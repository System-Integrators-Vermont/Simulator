/**
 * Leaderboard backend for System Integrators Simulator (Google Apps Script).
 *
 * The game talks to this as a web app:
 *   GET  ?limit=200            -> [{ name, score, ts }, ...] highest first
 *   POST {"name":..,"score":..} (sent as text/plain to skip the CORS preflight)
 *
 * Setup: open the Sheet, Extensions > Apps Script, paste this file, then
 * Deploy > Manage deployments > edit the web app deployment:
 *   Execute as: Me    Who has access: Anyone
 * Saving a new version keeps the same /exec URL the game already uses.
 *
 * Rows are Name | Score | Timestamp on a tab called "Scores". If your sheet
 * uses a different tab name or column order, change SHEET_NAME or the
 * column indexes below.
 */

const SHEET_NAME = 'Scores';
const MAX_NAME = 14;
// A perfect run is about 11,000 points. Anything far above that was not played.
const MAX_SCORE = 20000;

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const limit = Math.min(200, Math.max(1, parseInt((e && e.parameter.limit) || '200', 10) || 200));
  const rows = sheet_().getDataRange().getValues();
  const scores = rows
    .filter(r => typeof r[1] === 'number' && r[0] !== 'Name')
    .map(r => ({ name: String(r[0]).slice(0, MAX_NAME), score: r[1], ts: new Date(r[2]).getTime() || 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return json_(scores);
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'bad json' }); }

  // Strip anything that isn't a plain printable character, then trim to length
  const name = String(body.name || '').replace(/[^\p{L}\p{N} .'_-]/gu, '').trim().slice(0, MAX_NAME);
  const score = Math.floor(Number(body.score));
  if (!name) return json_({ ok: false, error: 'name required' });
  if (!Number.isFinite(score) || score < 0 || score > MAX_SCORE) return json_({ ok: false, error: 'bad score' });

  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    sheet_().appendRow([name, score, new Date()]);
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}
