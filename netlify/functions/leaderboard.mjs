// Leaderboard API for System Integrators Simulator.
//
//   POST /api/runs     start a run, returns a single-use runId
//   POST /api/scores   submit a finished run { runId, name, character, score, log }
//   GET  /api/scores   top scores, ?limit=10 (max 100)
//
// Scores live in Netlify Blobs. The server never trusts the score the game
// sends: it recomputes it from the run log using the same level data and
// rules the game uses (game-data.js), checks every count against what the
// level actually contains, and checks the run took at least as long as the
// level clocks say it did.

import { getStore } from '@netlify/blobs';
import { createHash, randomUUID } from 'node:crypto';
import { cleanName, checkLog, isCount } from '../../leaderboard/validate.mjs';

const BOARD_SIZE = 100;
const RUN_MAX_AGE_MS = 6 * 60 * 60 * 1000;
const LIMITS = { runs: 60, scores: 30 }; // per player per hour

const ALLOWED_ORIGINS = [
  'https://system-integrators-vermont.github.io',
  'https://si-simulator.netlify.app',
  'https://sivermont.com',
  'https://www.sivermont.com',
];
function allowOrigin(origin) {
  if (!origin) return null;
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  if (/^https:\/\/[a-z0-9-]+--si-simulator\.netlify\.app$/.test(origin)) return origin; // deploy previews
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return origin;
  return null;
}

function json(data, status, origin) {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  const allowed = allowOrigin(origin);
  if (allowed) {
    headers['Access-Control-Allow-Origin'] = allowed;
    headers['Vary'] = 'Origin';
  }
  return new Response(JSON.stringify(data), { status: status || 200, headers });
}

const stores = () => ({
  runs: getStore({ name: 'runs', consistency: 'strong' }),
  scores: getStore({ name: 'scores', consistency: 'strong' }),
  limits: getStore({ name: 'limits', consistency: 'strong' }),
});

// Players are identified only by a salted hash of their IP, for rate limiting
function playerKey(context) {
  const salt = Netlify.env.get('LB_SALT') || 'si-simulator';
  return createHash('sha256').update(salt + ':' + (context.ip || 'unknown')).digest('hex').slice(0, 24);
}

async function overLimit(s, kind, who) {
  const hour = Math.floor(Date.now() / 3600000);
  const key = `${kind}/${hour}/${who}`;
  const n = (await s.limits.get(key, { type: 'json' })) || 0;
  if (n >= LIMITS[kind]) return true;
  await s.limits.setJSON(key, n + 1);
  return false;
}

// ---------- Board ----------
// Each score is its own blob, so two players finishing at the same moment can
// never overwrite each other. The index key carries everything the board
// shows (inverted score first so keys sort best-first):
//   idx/<1e9 - score>~<ts>~<character>~<levels>~<runId>~<name>
// The full run record lives at rec/<runId> for auditing.
function indexKey(e) {
  return 'idx/' + [String(1e9 - e.score).padStart(10, '0'), e.ts, e.character, e.levels, e.id, encodeURIComponent(e.name)].join('~');
}
function parseIndexKey(key) {
  const [inv, ts, character, levels, id, name] = key.slice(4).split('~');
  return { id, name: decodeURIComponent(name), score: 1e9 - Number(inv), character, levels: Number(levels), ts: Number(ts) };
}
async function readBoard(s) {
  const { blobs } = await s.scores.list({ prefix: 'idx/' });
  const all = blobs.map(b => parseIndexKey(b.key)).sort((a, b) => b.score - a.score || a.ts - b.ts);
  return { all, total: all.length };
}

const publicEntry = e => ({ id: e.id, name: e.name, score: e.score, character: e.character, levels: e.levels, ts: e.ts });

export default async (req, context) => {
  const origin = req.headers.get('origin');
  if (req.method === 'OPTIONS') {
    const allowed = allowOrigin(origin);
    return new Response(null, {
      status: 204,
      headers: allowed ? {
        'Access-Control-Allow-Origin': allowed,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin',
      } : {},
    });
  }
  const s = stores();
  const path = new URL(req.url).pathname;

  try {
    if (path === '/api/scores' && req.method === 'GET') {
      const limit = Math.min(BOARD_SIZE, Math.max(1, parseInt(new URL(req.url).searchParams.get('limit') || '10', 10) || 10));
      const board = await readBoard(s);
      return json({ top: board.all.slice(0, limit).map(publicEntry), total: board.total }, 200, origin);
    }

    if (path === '/api/runs' && req.method === 'POST') {
      const who = playerKey(context);
      if (await overLimit(s, 'runs', who)) return json({ error: 'Too many games this hour. Try again later.' }, 429, origin);
      const runId = randomUUID();
      await s.runs.setJSON(runId, { startedAt: Date.now(), who });
      return json({ runId }, 200, origin);
    }

    if (path === '/api/scores' && req.method === 'POST') {
      let body;
      try { body = await req.json(); } catch (e) { return json({ error: 'Bad request' }, 400, origin); }
      const who = playerKey(context);
      if (await overLimit(s, 'scores', who)) return json({ error: 'Too many scores this hour. Try again later.' }, 429, origin);

      const runId = typeof body.runId === 'string' ? body.runId : '';
      const run = runId && (await s.runs.get(runId, { type: 'json' }));
      if (!run) return json({ error: 'This run was already submitted or has expired' }, 400, origin);
      await s.runs.delete(runId); // single use
      const elapsed = Date.now() - run.startedAt;
      if (elapsed > RUN_MAX_AGE_MS) return json({ error: 'This run has expired' }, 400, origin);

      const named = cleanName(body.name);
      if (named.error) return json({ error: named.error }, 400, origin);
      const score = body.score;
      if (!isCount(score)) return json({ error: 'Bad score' }, 400, origin);
      const problem = checkLog(body.log, score, elapsed);
      if (problem) return json({ error: 'Score not accepted: ' + problem }, 400, origin);

      const entry = {
        id: runId,
        name: named.name,
        score,
        character: ['she', 'they', 'he'].includes(body.character) ? body.character : 'they',
        levels: body.log.filter(e => e.completed).length,
        ts: Date.now(),
      };
      await s.scores.setJSON('rec/' + runId, { ...entry, log: body.log, elapsedMs: elapsed, who });
      await s.scores.set(indexKey(entry), '1');
      const board = await readBoard(s);
      const rank = board.all.findIndex(e => e.id === entry.id) + 1;
      return json({ ok: true, id: entry.id, rank: rank || null, total: board.total, top: board.all.slice(0, 10).map(publicEntry) }, 200, origin);
    }

    return json({ error: 'Not found' }, 404, origin);
  } catch (err) {
    console.error(err);
    return json({ error: 'Leaderboard error. Try again in a moment.' }, 500, origin);
  }
};

export const config = { path: ['/api/runs', '/api/scores'] };
