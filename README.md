# System Integrators Simulator

A side-scrolling browser game from System Integrators Vermont. You play an SI technician working a Vermont smart home job across three levels:

1. **Rough In** - run wire through the framing before the drywall goes up.
2. **Trim Out** - install TVs and speakers room by room, dodging burst pipes.
3. **Landscape Lighting** - light up the grounds at night.

Collect every item for a Clean Punch List bonus and beat the clock for a speed bonus. Level 1 hides two secret doors.

## Controls

| Key | Action |
| --- | --- |
| Left / Right | Move |
| Space or Up | Jump (hold for higher) |
| Up / Down | Climb ladders |
| Esc | Pause |

Phones and tablets get on-screen buttons.

## Running it

The game is plain HTML, CSS and JavaScript with no build step. It has to be served over HTTP, because the Level 2 rooms are cut out with a chroma key that browsers block on `file://` pages.

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

Handy URL options: `?level=2` or `?level=3` starts on that level, and `?debug` shows an FPS counter.

## Files

- `index.html` - the whole game: markup, styles and script.
- `assets/` - sprites, backgrounds and the music track.
- `assets/level2/` - Level 2 room art. Room images use neon orange, green and magenta zones that the game replaces with the roof, window and floor textures. Furniture sprites sit on neon green.

## Leaderboard

Scores post to a Google Apps Script web app backed by a Google Sheet (`LB_URL` in `index.html`). The last 200 scores are cached in the browser so the board still shows offline.

## Credits

Art and design by Nick Thibeault. Music: "Paper Lanterns", made with Suno.
