// Checks for submitted leaderboard runs. Pure functions, no storage, so they
// can be tested with `npm test`.
import GAME from '../game-data.js';

const { LEVELS, LEVEL_TIME, levelCaps, scoreEntry, isClean } = GAME;
export const MAX_NAME = 14;

// ---------- Names ----------
// A short list of words that shouldn't appear on a company leaderboard.
// Matching ignores case, spaces, punctuation and common letter swaps.
const BLOCKED = ['fuck', 'shit', 'cunt', 'bitch', 'dick', 'cock', 'pussy', 'nigg', 'fag', 'slut',
  'whore', 'rape', 'nazi', 'hitler', 'penis', 'vagina', 'anal', 'porn', 'twat', 'wank', 'bastard', 'asshole'];
export function cleanName(raw) {
  const name = String(raw || '')
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N} .'_-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_NAME);
  if (!name) return { error: 'Add a name to post your score' };
  const flat = name.toLowerCase()
    .replace(/[0@]/g, 'o').replace(/1|!/g, 'i').replace(/3/g, 'e').replace(/4/g, 'a').replace(/5|\$/g, 's').replace(/7/g, 't')
    .replace(/[^a-z]/g, '');
  if (BLOCKED.some(w => flat.includes(w))) return { error: 'Please pick a different name' };
  return { name };
}

// ---------- Run log checks ----------
export const isCount = n => Number.isInteger(n) && n >= 0;

export function checkLog(log, claimedScore, elapsedMs) {
  if (!Array.isArray(log) || log.length === 0 || log.length > LEVELS.length) return 'Bad run log';
  let total = 0;
  let lastLevel = -1;
  let minSeconds = 0;
  for (const e of log) {
    if (!e || !Number.isInteger(e.level) || e.level < 0 || e.level >= LEVELS.length) return 'Bad level';
    if (e.level <= lastLevel) return 'Levels out of order';
    lastLevel = e.level;
    const caps = levelCaps(e.level);
    const pickups = e.pickups || {};
    for (const t of Object.keys(pickups)) {
      if (!isCount(pickups[t]) || pickups[t] > (caps.pickups[t] || 0)) return 'Too many ' + t;
    }
    const inst = e.installs || {};
    for (const t of ['tv', 'speaker']) {
      const n = inst[t] || 0;
      if (!isCount(n) || n > caps.installs[t] || n > (pickups[t] || 0)) return 'Bad installs';
    }
    if (!isCount(e.keypads || 0) || (e.keypads || 0) > caps.keypads) return 'Bad keypads';
    if (![0, 1].includes(e.badge || 0) || (e.badge || 0) > caps.badge) return 'Bad badge';
    if (typeof e.completed !== 'boolean' || typeof e.clean !== 'boolean') return 'Bad entry';
    if (e.clean && !(e.completed && isClean(e))) return 'Bad clean bonus';
    const tb = e.timeBonus || 0;
    if (!isCount(tb) || tb > LEVEL_TIME || (!e.completed && tb > 0)) return 'Bad time bonus';
    if (e.completed) minSeconds += Math.max(10, LEVEL_TIME - tb - 3);
    total += scoreEntry(e);
  }
  if (total !== claimedScore) return 'Score does not match the run';
  // The level clocks only run while you play, so real time can't be shorter
  if (elapsedMs / 1000 < minSeconds) return 'Run finished faster than the clock allows';
  return null;
}

