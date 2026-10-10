// Run with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkLog, cleanName } from '../leaderboard/validate.mjs';
import GAME from '../game-data.js';

const { levelCaps, scoreEntry } = GAME;

// A perfect, clean run of one level with the given time bonus
function perfect(level, timeBonus) {
  const caps = levelCaps(level);
  const pickups = { ...caps.pickups };
  return { level, pickups, installs: { ...caps.installs }, keypads: caps.keypads, badge: 1, completed: true, clean: true, timeBonus };
}
const total = log => log.reduce((n, e) => n + scoreEntry(e), 0);
const MIN = 60 * 1000;

test('a perfect four-level run is accepted', () => {
  const log = [perfect(0, 40), perfect(1, 30), perfect(2, 20), perfect(3, 35)];
  assert.equal(checkLog(log, total(log), 10 * MIN), null);
});

test('a game over partway through a level is accepted', () => {
  const log = [perfect(0, 40), { level: 1, pickups: { hammer: 1, tv: 1 }, installs: { tv: 1, speaker: 0 }, keypads: 0, badge: 0, completed: false, clean: false, timeBonus: 0 }];
  assert.equal(checkLog(log, total(log), 5 * MIN), null);
});

test('skipping levels through a secret door is accepted', () => {
  const log = [{ level: 0, pickups: { wire: 2 }, installs: {}, keypads: 0, badge: 0, completed: false, clean: false, timeBonus: 0 }, perfect(2, 10)];
  assert.equal(checkLog(log, total(log), 3 * MIN), null);
});

test('a score that does not match the log is rejected', () => {
  const log = [perfect(0, 40)];
  assert.match(checkLog(log, total(log) + 1, 10 * MIN), /does not match/);
});

test('more items than the level holds is rejected', () => {
  const e = perfect(0, 40);
  e.pickups.wire += 5;
  assert.match(checkLog([e], scoreEntry(e), 10 * MIN), /Too many wire/);
});

test('items the level does not have are rejected', () => {
  const e = perfect(0, 40);
  e.pickups.light = 3;
  assert.match(checkLog([e], scoreEntry(e), 10 * MIN), /Too many light/);
});

test('installing more TVs than were picked up is rejected', () => {
  const e = perfect(1, 30);
  e.pickups.tv = e.installs.tv - 1;
  e.clean = false;
  assert.match(checkLog([e], scoreEntry(e), 10 * MIN), /Bad installs/);
});

test('a clean bonus without finishing everything is rejected', () => {
  const e = perfect(0, 40);
  e.pickups.wire -= 1;
  assert.match(checkLog([e], scoreEntry(e), 10 * MIN), /clean bonus/);
});

test('a time bonus bigger than the clock is rejected', () => {
  const e = perfect(0, 95);
  assert.match(checkLog([e], scoreEntry(e), 10 * MIN), /time bonus/);
});

test('finishing faster than the level clocks allow is rejected', () => {
  // Bonus 40 means 50 seconds on the clock, so 20 real seconds is impossible
  const log = [perfect(0, 40)];
  assert.match(checkLog(log, total(log), 20 * 1000), /faster than the clock/);
});

test('levels out of order or repeated are rejected', () => {
  const log = [perfect(1, 30), perfect(0, 40)];
  assert.match(checkLog(log, total(log), 10 * MIN), /out of order/);
  const twice = [perfect(0, 40), perfect(0, 40)];
  assert.match(checkLog(twice, total(twice), 10 * MIN), /out of order/);
});

test('names are cleaned and filtered', () => {
  assert.deepEqual(cleanName('  Nick   T  '), { name: 'Nick T' });
  assert.deepEqual(cleanName('<b>Al</b>'), { name: 'bAlb' });
  assert.equal(cleanName('ABCDEFGHIJKLMNOPQ').name.length, 14);
  assert.ok(cleanName('').error);
  assert.ok(cleanName('Sh1t Head').error);
  assert.ok(cleanName('F.U.C.K').error);
});
