# What makes a great 2D platformer, and what we took from it

Research notes for System Integrators Simulator, October 2026. Each section lists what the best games in this style do, how our game measured up, and what we changed.

## 1. Forgiveness: the game should want you to succeed (Celeste)

Maddy Thorson's list of Celeste's hidden assists: coyote time, jump buffering, halved gravity at the top of a held jump, corner correction when your head clips a ledge, wider wall-jump windows. Each one widens a timing or positioning window in the player's favor, so a hard game still feels kind.

- **We already had:** coyote time and jump buffering (10 frames each, generous) and variable jump height.
- **Added:** apex hang (gravity halves near the top of a held jump) and head-bump corner correction (clip the edge of a platform from below and you slide past instead of stopping dead).

## 2. Juice: every action gets a response (Jonasson and Purho, "Juice it or lose it", GDC 2012)

The talk showed a dull Breakout becoming fun purely through feedback: flashes, shake, particles, sound, floating text. Later guides add: tie effects to discrete events (jump, land, pickup, hit), keep them small and proportional, save hit-stop and shake for real impacts, and switch shake off for players who want reduced motion.

- **We had:** sounds, a landing dust effect so small it was invisible (drawn at the old half resolution), a 1 px landing squash.
- **Added:** a particle system (jump puffs, landing dust scaled to fall speed, pickup sparkles in each item's color, install and keypad bursts, hit sparks), visible squash and stretch on takeoff and landing, a 5-frame hit-stop with a small screen shake and red flash when you take damage, and phone vibration on hits. Shake and flashes respect the reduced-motion setting.

## 3. Teach by doing (Super Mario Bros. World 1-1)

Miyamoto and Tezuka built 1-1 so the level itself is the tutorial: introduce one idea in a safe spot, then repeat it with higher stakes. Browser-game research says the same thing from the other side: players leave within seconds if the goal isn't readable.

- **We had:** no explanation of what each level asks of you. The new carry-to-mount and keypad mechanics needed one.
- **Added:** a level card at the start of each level (name and a one-line goal), and one-time hints the first time you meet something new: a runaway spool, a TV to carry, a dark room's keypad. Each new hazard first appears alone on flat ground.

## 4. Camera that shows what's coming (Itay Keren, "Scroll Back", GDC 2015)

Keren's survey of side-scroller cameras recommends a forward focus: keep more screen in front of the player than behind, switch sides when they turn around, and ease every camera move.

- **We had:** a smooth follow that always framed the player at 40% from the left, so walking back left showed almost nothing ahead.
- **Added:** dual forward focus. The camera eases to 38% when you face right and 62% when you face left.

## 5. Optional challenge for players who want more (Celeste strawberries)

Strawberries never block progress. They sit just off the main route, use the same moves as the main game, and are tallied at the end. Finishing and mastering are separate goals.

- **We had:** optional items and two secret doors in Level 1.
- **Added:** one hidden SI badge per level, tucked somewhere that takes a deliberate detour or a tricky jump. The end-of-run summary shows how many you found.

## 6. Let players tune the difficulty (Celeste Assist Mode, Shovel Knight)

Assist Mode lets anyone slow the game, skip hazards or turn on invincibility, while the default stays challenging. Shovel Knight replaced hard game overs with a recoverable penalty and kept the extra challenge optional.

- **We had:** one fixed difficulty, a 90 second clock and three lives.
- **Added:** a Relaxed mode toggle on the character screen: no clock, and lives never run out. Relaxed runs don't post to the leaderboard, so it stays fair.

## 7. Respect the first 30 seconds (browser and mobile retention studies)

Web players are one click from another tab. Start fast, make the first action obvious, give a quick reward, and don't stack menus in front of play.

- **We had:** a 3-second intro you couldn't skip, a required name before you could play, and the character choice forgotten between visits.
- **Added:** click or press any key to skip the intro, Enter or Space to continue, the name is optional (you play as Guest and just don't go on the leaderboard), and your character choice is remembered.

## 8. Deaths should be a beat, not a cut (Shovel Knight, Celeste)

Both games make dying quick and readable: a short pause so you see what hit you, then straight back into play near where you were.

- **We had:** an instant teleport back to the start of the level.
- **Added (with checkpoints from the previous round):** a brief hit-stop and fade, then respawn at the last flag.

## 9. Composition and real-world scale (Wes Anderson, AV install practice)

Kogonada's "Wes Anderson // Centered" and David Bordwell's writing on Anderson's planimetric staging describe the look: the camera square to a back wall, the subject on the centre line, everything else mirrored around it, props on a few flat layers, generous empty wall. A side-scroller is already square to the wall, so the work is in placement.

Real installs give the numbers, at the game's scale of about 2 px per inch (checked against the art: the mudroom door is about 80 in, the kitchen counter about 36 in):

| Device | Real practice | In the game |
| --- | --- | --- |
| Lighting keypad | Centreline 48 in off the floor, beside the door on the latch side (builder convention; ADA allows 15 to 48 in) | 14 x 20 plate centred 96 px above the floor, just inside each room's entry |
| TV over a fireplace | 4 to 12 in above the mantel (Houzz, KEF) | 65 in TV (113 x 64) centred on the chimney, 8 in above the mantel |
| Left and right speakers | Mirrored exactly about the screen centre, at screen height (Sonance) | In-wall speakers 18 x 48, mirrored about each screen; black grilles in the theater |
| Pickups | Rest on a surface, or hover with a contact shadow (pixel art grounding practice) | Cartons on the floor, tools a fixed height over the surface below with a shadow |
| Carried items | A large item carried overhead reads as floating (Super Mario Bros. 2 re-tuned carry height per character) | Carried items go to a HUD slot |

**What we changed after playing it:**
- Measured every room and centred the furniture on its axis: sofa on the chimney, armchair on the window, wingbacks on their bookcases, theater rows on the screen, beds on the headboard and sconces, treadmill under the mirror.
- Keypads at 48 in. You stand at one for half a second to program it, rather than jumping at a plate near the ceiling.
- TV and speaker mounts at real heights. Empty mounts show as blue painter's tape at the exact footprint. The gym TV is mounted exactly over the TV painted in the art.
- Nothing floats. Scaffold boards stand on braced legs, garden-wall slabs sit on stone piers, cartons rest on the floor.
- The runaway spool became a large wooden cable reel, so the hazard no longer looks like the wire pickups.

Additional sources:
- [Wes Anderson // Centered, via Slashfilm](https://www.slashfilm.com/wes-anderson-symmetry-video)
- [David Bordwell on The Grand Budapest Hotel](https://www.davidbordwell.net/blog/2014/03/26/the-grand-budapest-hotel-wes-anderson-takes-the-43-challenge/)
- [Adam Stockhausen interview, Backstage](https://www.backstage.com/magazine/article/wes-andersons-production-designer-adam-stockhausen-interview-74172/)
- [ADA operable parts, US Access Board](https://www.access-board.gov/ada/guides/chapter-3-operable-parts/)
- [Light switch height, Bob Vila](https://bobvila.com/articles/light-switch-height)
- [Ideal TV height, KEF](https://us.kef.com/blogs/news/calculate-the-ideal-tv-height)
- [How high should your TV be, Houzz](https://www.houzz.com/magazine/how-high-should-your-tv-be-stsetivw-vs~47203714)
- [Sonance VP67 LCR manual](https://www.manualsdir.com/manuals/155526/sonance-visual-performance-vp67-lcr.html)
- [Choosing a pixel art resolution, Pixel Parmesan](https://pixelparmesan.com/choosing-the-right-resolution-for-your-pixel-art/)
- [Super Mario Bros. 2 prototype, The Cutting Room Floor](https://new.tcrf.net/Proto:Super_Mario_Bros._2_(NES))

## Sources

- [Celeste & Forgiveness](https://maddymakesgames.com/articles/celeste_and_forgiveness/), Maddy Thorson
- [Scroll Back: The Theory and Practice of Cameras in Side-Scrollers](https://www.gamedeveloper.com/design/scroll-back-the-theory-and-practice-of-cameras-in-side-scrollers), Itay Keren
- [Where Does Game Feel Come From](https://eastondev.com/blog/en/posts/dev/20260521-game-feedback-feel/) (summary of "Juice it or lose it")
- [Game Feel & Juice course](https://www.wayline.io/learn/game-feel/1), Wayline
- [On the genius design of World 1-1](https://also.kottke.org/24/08/0045144-on-the-genius-design-of), Kottke
- [How the spirit of World 1-1 carries on](https://avclub.com/how-the-spirit-of-the-original-world-1-1-carries-on-in-1798284208), AV Club
- [Checkpoint design](https://www.yachtclubgames.com/blog/check-point-design), Yacht Club Games
- [Celeste Assist Mode](https://gameaccessibilityguidelines.com/celeste-assist-mode), Game Accessibility Guidelines
- [Jumping and landing feedback devlog](https://rcxa.itch.io/vaults-and-vampires/devlog/662233/jumping-and-landing-feedback)
- [Designing games for short session behavior](https://meliorgames.com/game-development/designing-mobile-games-for-short-session-behavior/), Melior Games
- [Ten minutes is enough: browser games](https://www.albinoblacksheep.com/text/playhop), Albino Blacksheep
