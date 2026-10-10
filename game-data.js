// Level layouts and scoring rules for System Integrators Simulator.
// Shared by the game (index.html) and the leaderboard API
// (netlify/functions/leaderboard.mjs), so both agree on what a legitimate
// score looks like. Change a level here and the server's checks follow.
(function (root) {
  'use strict';

  const LEVEL_TIME = 90; // seconds per attempt

  // Type → render mode + point value. Used across all levels.
  const TYPES = {
    wire:        { sprite: 'wireYellow', altSprite: 'wireBlue', points: 25  },
    hammer:      { sprite: 'hammer',     points: 10  },
    cutter:      { sprite: 'cutter',     points: 50  },
    // Boxed on the floor: box size is roughly real carton size at 2 px per inch
    tv:          { sprite: 'tv',         points: 250, box: { w: 120, h: 76, label: '65"' } },
    speaker:     { sprite: 'speaker',    points: 100, box: { w: 28,  h: 60, label: '' } },
    // Level 3 (Landscape Lighting)
    wireGrey:    { sprite: 'wireGrey',    points: 25  },
    cutterNight: { sprite: 'cutterNight', points: 50  },
    light:       { sprite: 'light',       points: 150 },
    // Phone — picking it up "lights up" the tree at the player's tree.
    // Per-collectible `treeId` field tells drawTrees which tree to swap to lit.
    phone:       { sprite: 'phone',       points: 100 },
    // Hidden SI badge, one per level, off the main route (Celeste strawberries)
    badge:       { drawProc: 'badge',     points: 500 },
  };

  const KEYPAD_POINTS = 200;
  // Which run-summary line each pickup counts toward
  const STAT_FOR_TYPE = {
    wire: 'wire', wireGrey: 'wire', hammer: 'tools', cutter: 'tools', cutterNight: 'tools',
    light: 'lights', phone: 'trees', badge: 'badges',
  };

  const LEVELS = [
  {
    "name": "Rough In",
    "goalText": "Pull wire through the framing and reach the front door",
    "width": 8500,
    "spawnX": 800,
    "minX": -1400,
    "theme": "rough-in",
    "showVan": true,
    "showMansion": true,
    "platforms": [
      {
        "x": -1400,
        "y": 464,
        "w": 1400,
        "h": 76,
        "type": "ground"
      },
      {
        "x": -720,
        "y": 240,
        "w": 400,
        "h": 24,
        "type": "plat"
      },
      {
        "x": 0,
        "y": 464,
        "w": 1440,
        "h": 76,
        "type": "ground"
      },
      {
        "x": 1540,
        "y": 464,
        "w": 1020,
        "h": 76,
        "type": "ground"
      },
      {
        "x": 2640,
        "y": 464,
        "w": 1440,
        "h": 76,
        "type": "ground"
      },
      {
        "x": 4160,
        "y": 464,
        "w": 1120,
        "h": 76,
        "type": "ground"
      },
      {
        "x": 5360,
        "y": 464,
        "w": 3140,
        "h": 76,
        "type": "ground"
      },
      {
        "x": 760,
        "y": 376,
        "w": 160,
        "h": 24,
        "type": "plat"
      },
      {
        "x": 1020,
        "y": 312,
        "w": 160,
        "h": 24,
        "type": "plat"
      },
      {
        "x": 1280,
        "y": 376,
        "w": 160,
        "h": 24,
        "type": "plat"
      },
      {
        "x": 1760,
        "y": 356,
        "w": 192,
        "h": 24,
        "type": "plat"
      },
      {
        "x": 2120,
        "y": 284,
        "w": 192,
        "h": 24,
        "type": "plat"
      },
      {
        "x": 2480,
        "y": 356,
        "w": 192,
        "h": 24,
        "type": "plat"
      },
      {
        "x": 2960,
        "y": 336,
        "w": 160,
        "h": 24,
        "type": "plat"
      },
      {
        "x": 3240,
        "y": 260,
        "w": 160,
        "h": 24,
        "type": "plat"
      },
      {
        "x": 3560,
        "y": 336,
        "w": 160,
        "h": 24,
        "type": "plat"
      },
      {
        "x": 3900,
        "y": 400,
        "w": 160,
        "h": 24,
        "type": "plat"
      },
      {
        "x": 4400,
        "y": 360,
        "w": 160,
        "h": 24,
        "type": "plat"
      },
      {
        "x": 4680,
        "y": 300,
        "w": 160,
        "h": 24,
        "type": "plat"
      },
      {
        "x": 4960,
        "y": 360,
        "w": 160,
        "h": 24,
        "type": "plat"
      },
      {
        "x": 5560,
        "y": 356,
        "w": 192,
        "h": 24,
        "type": "plat"
      },
      {
        "x": 5880,
        "y": 284,
        "w": 192,
        "h": 24,
        "type": "plat"
      },
      {
        "x": 6200,
        "y": 356,
        "w": 192,
        "h": 24,
        "type": "plat"
      },
      {
        "x": 6560,
        "y": 400,
        "w": 192,
        "h": 24,
        "type": "plat"
      }
    ],
    "ladders": [
      {
        "x": -440,
        "topY": 240,
        "botY": 464,
        "w": 56
      },
      {
        "x": 1048,
        "topY": 312,
        "botY": 464,
        "w": 56
      },
      {
        "x": 2148,
        "topY": 284,
        "botY": 464,
        "w": 56
      },
      {
        "x": 3268,
        "topY": 260,
        "botY": 464,
        "w": 56
      },
      {
        "x": 5908,
        "topY": 284,
        "botY": 464,
        "w": 56
      }
    ],
    "warpDoors": [
      {
        "x": -600,
        "y": 120,
        "w": 80,
        "h": 120,
        "target": 2,
        "label": "3"
      },
      {
        "x": -1000,
        "y": 344,
        "w": 80,
        "h": 120,
        "target": 1,
        "label": "2"
      }
    ],
    "collectiblesInit": [
      {
        "x": 640,
        "y": 400,
        "t": "wire",
        "v": 0
      },
      {
        "x": 760,
        "y": 400,
        "t": "hammer"
      },
      {
        "x": 900,
        "y": 316,
        "t": "wire",
        "v": 1
      },
      {
        "x": 1080,
        "y": 252,
        "t": "cutter"
      },
      {
        "x": 1320,
        "y": 316,
        "t": "hammer"
      },
      {
        "x": 1600,
        "y": 400,
        "t": "wire",
        "v": 0
      },
      {
        "x": 1600,
        "y": 320,
        "t": "wire",
        "v": 1
      },
      {
        "x": 1600,
        "y": 240,
        "t": "wire",
        "v": 0
      },
      {
        "x": 1810,
        "y": 296,
        "t": "wire",
        "v": 0
      },
      {
        "x": 2170,
        "y": 224,
        "t": "cutter"
      },
      {
        "x": 2530,
        "y": 296,
        "t": "wire",
        "v": 1
      },
      {
        "x": 3000,
        "y": 276,
        "t": "hammer"
      },
      {
        "x": 3290,
        "y": 200,
        "t": "cutter"
      },
      {
        "x": 3600,
        "y": 276,
        "t": "wire",
        "v": 0
      },
      {
        "x": 3970,
        "y": 340,
        "t": "hammer"
      },
      {
        "x": 4450,
        "y": 300,
        "t": "wire",
        "v": 1
      },
      {
        "x": 4730,
        "y": 240,
        "t": "cutter"
      },
      {
        "x": 5020,
        "y": 300,
        "t": "wire",
        "v": 0
      },
      {
        "x": 5620,
        "y": 296,
        "t": "hammer"
      },
      {
        "x": 5930,
        "y": 224,
        "t": "cutter"
      },
      {
        "x": 6250,
        "y": 296,
        "t": "wire",
        "v": 1
      },
      {
        "x": 6600,
        "y": 340,
        "t": "wire",
        "v": 0
      },
      {
        "x": 6900,
        "y": 400,
        "t": "hammer"
      }
    ],
    "secretBadge": { "x": -520, "y": 110 },
    "hazards": [
      { "type": "spool", "x": 3200, "y": 404, "w": 60, "h": 60, "minX": 2760, "maxX": 3960, "vx": 2.4 },
      { "type": "spool", "x": 4700, "y": 404, "w": 60, "h": 60, "minX": 4400, "maxX": 5200, "vx": -2.8 },
      { "type": "spool", "x": 6600, "y": 404, "w": 60, "h": 60, "minX": 6100, "maxX": 7300, "vx": 3.2 }
    ],
    "checkpoints": [2700, 4200, 5500],
    "goal": {
      "x": 7602,
      "y": 336,
      "w": 96,
      "h": 128
    },
    "bgSections": [],
    "beams": [],
    "rocks": [],
    "trees": []
  },
  {
    "name": "Trim Out",
    "goalText": "Carry each TV and speaker to its mount",
    "width": 9680,
    "spawnX": 200,
    "theme": "trim-out",
    "showVan": true,
    "showMansion": false,
    "indoorThresholdX": 1280,
    "platforms": [
      { "x": 0,    "y": 464, "w": 2100, "h": 76, "type": "ground" },
      { "x": 2196, "y": 464, "w": 1364, "h": 76, "type": "ground" },
      { "x": 3656, "y": 464, "w": 3294, "h": 76, "type": "ground" },
      { "x": 7046, "y": 464, "w": 2634, "h": 76, "type": "ground" },
      { "x": 1500, "y": 374, "w": 180, "h": 90, "type": "lv2obstacle", "sprite": "Lv2_ConsoleTable" },
      { "x": 3200, "y": 304, "w": 300, "h": 160, "type": "lv2obstacle", "sprite": "Lv2_KitchenIsland" },
      { "x": 3957, "y": 354, "w": 360, "h": 110, "type": "lv2obstacle", "sprite": "Lv2_Sofa" },      // centred on the chimney (x 4137)
      { "x": 4388, "y": 320, "w": 144, "h": 144, "type": "lv2obstacle", "sprite": "Lv2_Armchair" },  // centred on the window
      { "x": 4720, "y": 294, "w": 140, "h": 170, "type": "lv2obstacle", "sprite": "Lv2_Wingback" },
      { "x": 5143, "y": 294, "w": 140, "h": 170, "type": "lv2obstacle", "sprite": "Lv2_Wingback" },  // each chair centred on its bookcase
      { "x": 5520, "y": 394, "w": 160, "h": 70, "type": "lv2obstacle", "sprite": "Lv2_Bench" },        // centred on the window (x 5600)
      { "x": 5924, "y": 284, "w": 360, "h": 180, "type": "lv2obstacle", "sprite": "Lv2_TheaterRow" },  // rows mirror about
      { "x": 6354, "y": 284, "w": 360, "h": 180, "type": "lv2obstacle", "sprite": "Lv2_TheaterRow" },  // the screen (x 6319)
      { "x": 7526, "y": 334, "w": 360, "h": 130, "type": "lv2obstacle", "sprite": "Lv2_KingBed" }, // centred on the headboard panel
      { "x": 8101, "y": 354, "w": 270, "h": 110, "type": "lv2obstacle", "sprite": "Lv2_QueenBed" },    // centred on window and sconces (x 8236)
      { "x": 8560, "y": 314, "w": 200, "h": 150, "type": "lv2obstacle", "sprite": "Lv2_Treadmill" }    // under the mirror and TV
    ],
    "ladders": [],
    "collectiblesInit": [
      // Boxed TVs and speakers sit on the floor, staged in mirrored pairs
      { "x": 1766, "t": "tv" },        // centred under the entry chandelier
      { "x": 2390, "t": "speaker" },   // pair either side of the front hall window
      { "x": 2570, "t": "speaker" },
      { "x": 5470, "t": "speaker" },   // pair either side of the centre hall bench
      { "x": 5730, "t": "speaker" },
      { "x": 7410, "t": "tv" },        // primary suite floor, left of the bed
      // Tools hover a fixed height above whatever surface is below them
      { "x": 2480, "t": "hammer" },
      { "x": 2900, "t": "cutter" },
      { "x": 7706, "t": "cutter" },
      { "x": 8236, "t": "hammer" }
    ],
    "hazards": [
      { "type": "burstPipe", "x": 3050, "y": 296, "w": 70, "h": 168 },
      { "type": "burstPipe", "x": 8960, "y": 296, "w": 70, "h": 168 }
    ],
    // Mount points, measured from the room art (about 2 px per inch, floor at y 464).
    // x, y are the centre. TVs are 65" (113 x 64); in-wall speakers are 18 x 48.
    // Each pair of speakers mirrors exactly about its screen's centre line.
    "installs": [
      // Great Room: TV centred on the chimney, 8" above the mantel (mantel top y 310)
      { "t": "tv",      "x": 4137, "y": 262, "w": 113, "h": 64, "room": "Great Room" },
      { "t": "speaker", "x": 3987, "y": 262, "w": 18,  "h": 48, "room": "Great Room" },
      { "t": "speaker", "x": 4287, "y": 262, "w": 18,  "h": 48, "room": "Great Room" },
      // Theater: left and right flanking the screen (centre x 6319, y 255)
      { "t": "speaker", "x": 6074, "y": 255, "w": 18,  "h": 48, "room": "Theater", "finish": "black" },
      { "t": "speaker", "x": 6564, "y": 255, "w": 18,  "h": 48, "room": "Theater", "finish": "black" },
      // Home Gym: exactly over the TV painted above the mirror
      { "t": "tv",      "x": 8660, "y": 152, "w": 106, "h": 64, "room": "Home Gym", "coverArt": true }
    ],
    // Flags stand just before each doorway; keypads sit just past it
    "checkpoints": [2650, 4590, 5790, 7230],
    "secretBadge": { "x": 4786, "y": 150 },
    "bgSections": [
      { "type": "exterior", "bg": "Lv2_Exterior",   "x": 0,    "w": 1280 },
      { "type": "interior", "bg": "Lv2_GrandEntry", "x": 1280, "w": 960  },
      { "type": "interior", "bg": "Lv2_HallA",      "x": 2240, "w": 480  },
      { "type": "interior", "bg": "Lv2_Kitchen",    "x": 2720, "w": 960  },
      { "type": "interior", "bg": "Lv2_GreatRoom",  "x": 3680, "w": 960  },
      { "type": "interior", "bg": "Lv2_Library",    "x": 4640, "w": 720  },
      { "type": "interior", "bg": "Lv2_HallB",      "x": 5360, "w": 480  },
      { "type": "interior", "bg": "Lv2_Theater",    "x": 5840, "w": 960  },
      { "type": "interior", "bg": "Lv2_HallC",      "x": 6800, "w": 480  },
      { "type": "interior", "bg": "Lv2_PrimaryBed", "x": 7280, "w": 720  },
      { "type": "interior", "bg": "Lv2_GuestBed",   "x": 8000, "w": 480  },
      { "type": "interior", "bg": "Lv2_Gym",        "x": 8480, "w": 720  },
      { "type": "interior", "bg": "Lv2_Mudroom",    "x": 9200, "w": 480  }
    ],
    "beams": [1280, 2240, 2720, 3680, 4640, 5360, 5840, 6800, 7280, 8000, 8480, 9200],
    "pits": [
      { "x": 2100, "w": 96 },
      { "x": 3560, "w": 96 },
      { "x": 6950, "w": 96 }
    ],
    "goal": { "x": 9540, "y": 304, "w": 64, "h": 160 },
    "rocks": [],
    "trees": [],
    "warpDoors": []
  },
  {
    "name": "Landscape Lighting",
    "goalText": "Set the fixtures and grab the phones to light the trees",
    "width": 8000,
    "spawnX": 200,
    "theme": "night",
    "showVan": false,
    "showMansion": true,
    "platforms": [
      {
        "x": 0,
        "y": 464,
        "w": 8000,
        "h": 76,
        "type": "ground-night"
      },
      {
        "x": 960,
        "y": 360,
        "w": 220,
        "h": 24,
        "type": "plat-black"
      },
      {
        "x": 1900,
        "y": 316,
        "w": 220,
        "h": 24,
        "type": "plat-black"
      },
      {
        "x": 3000,
        "y": 290,
        "w": 240,
        "h": 24,
        "type": "plat-black"
      },
      {
        "x": 4100,
        "y": 350,
        "w": 220,
        "h": 24,
        "type": "plat-black"
      },
      {
        "x": 5200,
        "y": 300,
        "w": 240,
        "h": 24,
        "type": "plat-black"
      },
      {
        "x": 6300,
        "y": 330,
        "w": 220,
        "h": 24,
        "type": "plat-black"
      }
    ],
    "ladders": [],
    "collectiblesInit": [
      {
        "x": 420,
        "y": 420,
        "t": "light"
      },
      {
        "x": 500,
        "y": 420,
        "t": "light"
      },
      {
        "x": 580,
        "y": 420,
        "t": "light"
      },
      {
        "x": 820,
        "y": 420,
        "t": "wireGrey"
      },
      {
        "x": 910,
        "y": 420,
        "t": "wireGrey"
      },
      {
        "x": 1000,
        "y": 334,
        "t": "light"
      },
      {
        "x": 1070,
        "y": 334,
        "t": "light"
      },
      {
        "x": 1140,
        "y": 334,
        "t": "light"
      },
      {
        "x": 1660,
        "y": 420,
        "t": "cutterNight"
      },
      {
        "x": 1740,
        "y": 420,
        "t": "cutterNight"
      },
      {
        "x": 2600,
        "y": 420,
        "t": "wireGrey"
      },
      {
        "x": 2690,
        "y": 420,
        "t": "wireGrey"
      },
      {
        "x": 2780,
        "y": 420,
        "t": "wireGrey"
      },
      {
        "x": 3050,
        "y": 264,
        "t": "light"
      },
      {
        "x": 3120,
        "y": 264,
        "t": "light"
      },
      {
        "x": 3190,
        "y": 264,
        "t": "light"
      },
      {
        "x": 3640,
        "y": 400,
        "t": "light"
      },
      {
        "x": 3640,
        "y": 320,
        "t": "light"
      },
      {
        "x": 3640,
        "y": 240,
        "t": "light"
      },
      {
        "x": 4140,
        "y": 324,
        "t": "light"
      },
      {
        "x": 4210,
        "y": 324,
        "t": "light"
      },
      {
        "x": 4280,
        "y": 324,
        "t": "light"
      },
      {
        "x": 4760,
        "y": 420,
        "t": "wireGrey"
      },
      {
        "x": 4850,
        "y": 420,
        "t": "wireGrey"
      },
      {
        "x": 5800,
        "y": 420,
        "t": "cutterNight"
      },
      {
        "x": 5900,
        "y": 420,
        "t": "cutterNight"
      },
      {
        "x": 7000,
        "y": 420,
        "t": "light"
      },
      {
        "x": 7100,
        "y": 420,
        "t": "light"
      },
      {
        "x": 7200,
        "y": 420,
        "t": "light"
      },
      {
        "x": 400,
        "y": 424,
        "t": "phone",
        "treeId": 0
      },
      {
        "x": 760,
        "y": 424,
        "t": "phone",
        "treeId": 1
      },
      {
        "x": 1210,
        "y": 424,
        "t": "phone",
        "treeId": 2
      },
      {
        "x": 1680,
        "y": 424,
        "t": "phone",
        "treeId": 3
      },
      {
        "x": 2160,
        "y": 424,
        "t": "phone",
        "treeId": 4
      },
      {
        "x": 2560,
        "y": 424,
        "t": "phone",
        "treeId": 5
      },
      {
        "x": 3240,
        "y": 424,
        "t": "phone",
        "treeId": 6
      },
      {
        "x": 3800,
        "y": 424,
        "t": "phone",
        "treeId": 7
      },
      {
        "x": 4350,
        "y": 424,
        "t": "phone",
        "treeId": 8
      },
      {
        "x": 4800,
        "y": 424,
        "t": "phone",
        "treeId": 9
      },
      {
        "x": 5470,
        "y": 424,
        "t": "phone",
        "treeId": 10
      },
      {
        "x": 5900,
        "y": 424,
        "t": "phone",
        "treeId": 11
      },
      {
        "x": 6550,
        "y": 424,
        "t": "phone",
        "treeId": 12
      },
      {
        "x": 7000,
        "y": 424,
        "t": "phone",
        "treeId": 13
      }
    ],
    "hazards": [],
    "rocks": [
      {
        "x": 640,
        "w": 100,
        "h": 64
      },
      {
        "x": 1360,
        "w": 120,
        "h": 72
      },
      {
        "x": 2360,
        "w": 100,
        "h": 64
      },
      {
        "x": 3400,
        "w": 130,
        "h": 76
      },
      {
        "x": 4500,
        "w": 100,
        "h": 64
      },
      {
        "x": 5560,
        "w": 110,
        "h": 68
      },
      {
        "x": 6760,
        "w": 100,
        "h": 64
      }
    ],
    "trees": [
      {
        "id": 0,
        "type": "oak",
        "x": 400,
        "scale": 1.05
      },
      {
        "id": 1,
        "type": "pine",
        "x": 720,
        "scale": 0.95
      },
      {
        "id": 2,
        "type": "maple",
        "x": 1160,
        "scale": 1.0
      },
      {
        "id": 3,
        "type": "oak",
        "x": 1680,
        "scale": 0.9
      },
      {
        "id": 4,
        "type": "pine",
        "x": 2160,
        "scale": 1.0
      },
      {
        "id": 5,
        "type": "maple",
        "x": 2560,
        "scale": 1.05
      },
      {
        "id": 6,
        "type": "pine",
        "x": 3240,
        "scale": 0.95
      },
      {
        "id": 7,
        "type": "oak",
        "x": 3800,
        "scale": 1.0
      },
      {
        "id": 8,
        "type": "maple",
        "x": 4300,
        "scale": 0.95
      },
      {
        "id": 9,
        "type": "pine",
        "x": 4800,
        "scale": 1.05
      },
      {
        "id": 10,
        "type": "oak",
        "x": 5400,
        "scale": 0.95
      },
      {
        "id": 11,
        "type": "maple",
        "x": 5900,
        "scale": 1.0
      },
      {
        "id": 12,
        "type": "pine",
        "x": 6500,
        "scale": 1.05
      },
      {
        "id": 13,
        "type": "oak",
        "x": 7000,
        "scale": 0.95
      }
    ],
    "checkpoints": [2250, 4000, 6000], // on open ground, clear of the garden walls
    "secretBadge": { "x": 3120, "y": 150 },
    "goal": {
      "x": 7558,
      "y": 304,
      "w": 96,
      "h": 160
    },
    "bgSections": [],
    "beams": [],
    "warpDoors": []
  }
];

  const ROOM_NAMES = {
    Lv2_GrandEntry: 'Grand Entry', Lv2_HallA: 'Front Hall', Lv2_Kitchen: 'Kitchen',
    Lv2_GreatRoom: 'Great Room', Lv2_Library: 'Library', Lv2_HallB: 'Center Hall',
    Lv2_Theater: 'Theater', Lv2_HallC: 'Back Hall', Lv2_PrimaryBed: 'Primary Suite',
    Lv2_GuestBed: 'Guest Room', Lv2_Gym: 'Home Gym', Lv2_Mudroom: 'Mudroom',
  };

  // Keypad left edges, measured room by room from the art: just inside each
  // entry, clear of columns, mirrors and cubbies.
  const KEYPAD_CENTER_Y = 464 - 96;
  const KEYPAD_X = {
    Lv2_GrandEntry: 1350,  // right of the entry column
    Lv2_HallA:      2300,
    Lv2_Kitchen:    2770,  // on the backsplash, between counter and upper cabinets
    Lv2_GreatRoom:  3712,
    Lv2_Library:    4672,
    Lv2_HallB:      5420,
    Lv2_Theater:    6312,  // centred in the aisle, on the screen's axis
    Lv2_HallC:      6832,
    Lv2_PrimaryBed: 7312,
    Lv2_GuestBed:   8032,
    Lv2_Gym:        9150,  // right of the window; the mirror fills the entry wall
    Lv2_Mudroom:    9508,  // latch side of the exit door
  };

  // Level 4 reuses the Trim Out house. Every room starts dark; programming the
  // keypad by its doorway (jump to reach it) lights the room.
  function buildCommissioningLevel(base) {
    const lvl = JSON.parse(JSON.stringify(base));
    lvl.name = 'Commissioning';
    lvl.goalText = 'Jump to each keypad to bring the house to life';
    lvl.theme = 'commissioning';
    lvl.collectiblesInit = [];
    // What you installed in Trim Out is on the walls now
    lvl.decorInstalls = lvl.installs;
    lvl.installs = [];
    lvl.secretBadge = { x: 7706, y: 200 }; // above the king bed
    // Keypads centred 48" off the floor (96 px), on the first clear wall inside
    // each room's entry. Plate is 14 x 20, about a 4-button keypad at game scale.
    lvl.keypads = lvl.bgSections
      .filter(sec => sec.type === 'interior')
      .map(sec => ({ x: KEYPAD_X[sec.bg], y: KEYPAD_CENTER_Y - 10, w: 14, h: 20, room: sec.bg }));
    lvl.hazards = [
      { type: 'roomba', x: 2400, y: 444, w: 56, h: 20, minX: 2250, maxX: 2700, vx: 1.6 },
      { type: 'roomba', x: 2900, y: 444, w: 56, h: 20, minX: 2760, maxX: 3180, vx: -1.8 },
      { type: 'roomba', x: 7120, y: 444, w: 56, h: 20, minX: 7060, maxX: 7260, vx: 2.0 },
      { type: 'roomba', x: 9300, y: 444, w: 56, h: 20, minX: 9220, maxX: 9500, vx: -1.6 },
    ];
    return lvl;
  }
  LEVELS.push(buildCommissioningLevel(LEVELS[1]));

  // ---------- Scoring rules (used to verify submitted runs) ----------
  const CLEAN_BONUS = 500;

  // The most of each thing a level contains
  function levelCaps(idx) {
    const lvl = LEVELS[idx];
    const pickups = {};
    for (const c of lvl.collectiblesInit) pickups[c.t] = (pickups[c.t] || 0) + 1;
    const installs = { tv: 0, speaker: 0 };
    for (const m of (lvl.installs || [])) installs[m.t]++;
    return {
      pickups, installs,
      keypads: (lvl.keypads || []).length,
      badge: lvl.secretBadge ? 1 : 0,
    };
  }

  // Points for one level entry of a run log:
  // { level, pickups: {type: n}, installs: {tv, speaker}, keypads, badge, completed, clean, timeBonus }
  function scoreEntry(e) {
    let pts = 0;
    for (const t in (e.pickups || {})) {
      // TVs and speakers score when installed, not when picked up
      if (t === 'tv' || t === 'speaker') continue;
      pts += (TYPES[t] ? TYPES[t].points : 0) * e.pickups[t];
    }
    pts += (e.installs ? (e.installs.tv || 0) * TYPES.tv.points + (e.installs.speaker || 0) * TYPES.speaker.points : 0);
    pts += (e.keypads || 0) * KEYPAD_POINTS;
    pts += (e.badge || 0) * TYPES.badge.points;
    if (e.completed && e.clean) pts += CLEAN_BONUS;
    if (e.completed) pts += e.timeBonus || 0;
    return pts;
  }

  // True when every regular item in the level was collected, installed or programmed
  function isClean(e) {
    const caps = levelCaps(e.level);
    for (const t in caps.pickups) {
      if (t === 'badge') continue;
      if (((e.pickups || {})[t] || 0) < caps.pickups[t]) return false;
    }
    if (((e.installs || {}).tv || 0) < caps.installs.tv) return false;
    if (((e.installs || {}).speaker || 0) < caps.installs.speaker) return false;
    return (e.keypads || 0) >= caps.keypads;
  }

  const DATA = {
    LEVEL_TIME, TYPES, KEYPAD_POINTS, CLEAN_BONUS, STAT_FOR_TYPE, LEVELS, ROOM_NAMES,
    levelCaps, scoreEntry, isClean,
  };
  if (typeof module === 'object' && module.exports) module.exports = DATA;
  else root.SIS_DATA = DATA;
})(typeof self !== 'undefined' ? self : this);
