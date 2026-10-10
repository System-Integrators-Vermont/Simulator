# System Integrators Simulator

**Play it: https://system-integrators-vermont.github.io/Simulator/**

A side-scrolling browser game from System Integrators Vermont. You play an SI technician working a Vermont smart home job across four levels:

1. **Rough In** - pull wire through the framing. Watch for runaway wire spools.
2. **Trim Out** - pick up TVs and speakers and carry them to their mounts, room by room, dodging burst pipes.
3. **Landscape Lighting** - set fixtures and light up the trees at night.
4. **Commissioning** - the house is dark. Jump to the keypad in each room to program it and bring the lights up, without tripping over the robot vacuums.

Each level has a 90-second clock and checkpoint flags, so a fall sends you back to the last flag instead of the van. Finish everything in a level for a Clean Punch List bonus, and save time for a speed bonus. Every level hides an orange SI badge off the main route, and Level 1 hides two secret doors.

**Relaxed mode** (a checkbox on the character screen) turns off the clock and gives unlimited lives. Relaxed runs don't post to the leaderboard. The name is optional too. Without one you play as a guest and your score stays local.

The design thinking behind the game feel, camera, hints and difficulty options is in [docs/design-research.md](docs/design-research.md).

## Controls

| Keyboard | Controller | Action |
| --- | --- | --- |
| Left / Right or A / D | D-pad or left stick | Move |
| Space, Up or W | A | Jump (hold for higher) |
| Up / Down or W / S | D-pad | Climb ladders |
| Esc | Start | Pause |

Phones and tablets get on-screen buttons. The jump button also climbs ladders.

## Running it

The game is plain HTML, CSS and JavaScript with no build step. It has to be served over HTTP, because the house rooms are cut out with a chroma key that browsers block on `file://` pages.

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

URL options: `?level=2`, `?level=3` or `?level=4` starts on that level. `?debug` shows an FPS counter and exposes `window.__pl` for testing (player, state, and `step(n)` to advance the game by hand).

## Files

- `index.html` - the whole game: markup, styles and script.
- `assets/` - sprites, backgrounds and the music track.
- `assets/level2/` - house art for Trim Out and Commissioning. Room images use neon orange, green and magenta zones that the game replaces with the roof, window and floor textures. Furniture sprites sit on neon green.
- `leaderboard/Code.gs` - the Google Apps Script behind the leaderboard.

## Leaderboard

Scores are shared by everyone who plays. The game is hosted twice, with one leaderboard behind both:

- https://si-simulator.netlify.app - Netlify project `si-simulator` (System Integrators team). Hosts the game and the leaderboard API.
- https://system-integrators-vermont.github.io/Simulator/ - GitHub Pages, updates on every push to `main`, and calls the API above.

How a score gets on the board (`netlify/functions/leaderboard.mjs`):

1. Starting a game calls `POST /api/runs`, which returns a single-use run id and records the start time.
2. Finishing (or a Game Over) sends `POST /api/scores` with the name and a run log: what was collected, installed and programmed in each level, plus clean and time bonuses.
3. The server recomputes the score from the log with the same level data the game uses (`game-data.js`), and rejects the run if any count is higher than the level holds, the levels are out of order, the clock bonuses are impossible, or the run finished faster than the level clocks allow (`leaderboard/validate.mjs`).
4. Accepted runs are stored in Netlify Blobs, one entry per score so simultaneous finishes can't overwrite each other. Names are cleaned and filtered. Each player is limited to 60 games and 30 posted scores an hour.

Guests (no name) and Relaxed mode runs are not posted. A determined cheater could still script a perfect-looking run, but they can't post a score higher than a perfect run, and they have to wait out the real clock to do it.

Run the checks with `npm test`. To run the API locally, `npm install` then `netlify dev` (http://localhost:8888).

### Deploying the API

GitHub Pages updates itself. The Netlify copy deploys from this folder:

```bash
netlify deploy --prod --dir . --functions netlify/functions
```

## Credits

Art and design by Nick Thibeault. Music: "Paper Lanterns", made with Suno.
