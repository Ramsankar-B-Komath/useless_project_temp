<img width="1280" height="640" alt="git (1)" src="https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd" />



# Ragebait CAPTCHA From Hell



## Basic Details

### Team Name: The Other Way



### Team Members

* Team Lead: Ramsankar B Komath - Model Engineering College, Thrikkakara
* Member 2: Neel A Ved - Model Engineering College, Thrikkakara

### Project Description

The **Ragebait CAPTCHA From Hell** is a satirical, high-friction, client-side web application disguised as an increasingly absurd human verification protocol. Rather than checking simple bot puzzles, it subjects the user to neuromotor, acoustic, emotional, and cognitive trials to "separate genuine human biology from synthetic algorithms."

### The Problem (that doesn't exist)

CAPTCHAs are too simple and generic.

### The Solution (that nobody asked for)

We make them hard, annoying and fun.

## Technical Details

### Technologies/Components Used

For Software:

* HTML5
* CSS3 / PostCSS
* Tailwind CSS (v3 via CDN)
* Vanilla JavaScript (ES6+)
* Web Audio API
* WebRTC \& Media Capture
* HTML5 Canvas 2D API
* PowerShell (v5.1+)

### Implementation

For Software:

# Architecture \& Directory Structure

```text
ragebait-captcha/
├── index.html               # Main application entry point \\\\\\\& layout chassis
├── server.ps1               # Lightweight static PowerShell HTTP server
├── start\\\\\\\_server.bat         # 1-click Windows runner script
├── css/
│   └── styles.css           # Hellfire gradients, CRT monitor overlays, Minecraft UI, animations
├── assets/
│   ├── audio/
│   │   └── fail\\\\\\\_custom.mp3  # Custom rage scream fail audio (Wither \\\\\\\& Basketball misses)
│   └── images/              # Custom sprites and wallpapers
│       ├── beacon.png, nether\\\\\\\_star.png, obsidian.png, glass.png
│       ├── crafting\\\\\\\_table\\\\\\\_gui.jpg
│       ├── mole\\\\\\\_normal.png, mole\\\\\\\_stunned.png
│       ├── wither.png
│       ├── rias\\\\\\\_pfp.png
│       ├── gd\\\\\\\_cube.png, gd\\\\\\\_ship.png, gd\\\\\\\_spike.jpg, gd\\\\\\\_double\\\\\\\_spike.png
│       ├── gd\\\\\\\_portal.png, gd\\\\\\\_bg.jpg
│       ├── header\\\\\\\_panel.png
│       └── title\\\\\\\_screen.png
└── js/
    ├── state.js             # Global telemetry store (gameState) \\\\\\\& stage catalog
    ├── audio.js             # Procedural Web Audio API sound engine (SoundEngine)
    ├── sprites.js           # Universal asset resolver (SVG strings \\\\\\\& Canvas Image preloader)
    ├── app.js               # Main router, header overlay updater, title screen \\\\\\\& CRT terminal
    └── stages/
        ├── stage0.js        # The Bait Checkbox
        ├── stage1.js        # Screaming Decibel Verification (AudioContext AnalyserNode)
        ├── stage2.js        # Affirmations Grid (Decoy randomization)
        ├── stage3.js        # Hyper-Speed Whack-a-Mole (4 moles, \\\\\\\~0.35s darting)
        ├── stage4.js        # Emotional Breakup Simulator (Rias dialogue tree)
        ├── stage5.js        # Minecraft Wither CPS Battle (40 clicks in 4s)
        ├── stage6.js        # Authentic Beacon Crafting (3x3 grid drag/click)
        ├── stage7.js        # Happiness Facial Emotion Exam (Webcam stream)
        ├── stage8.js        # Moving Rim Basketball Physics Engine
        ├── stage9.js        # Real-time Stock Market Terminal
        └── stage10.js       # Geometry Dash Clutterfunk Sprint (60 FPS Platformer)
```

# Installation

\[commands]

# Run

\## Quick Start (Windows)



\### Option 1: One-Click Local Server (Recommended for Mic \& Webcam)

Double-click `start\_server.bat` or run in PowerShell:

```powershell

powershell -ExecutionPolicy Bypass -File .\\server.ps1

```

Then open your browser to:

```

http://localhost:8080/

```



\### Option 2: Direct File Open

Double-click `index.html` to open directly in Chrome, Edge, or Firefox.



### Project Documentation

# End-to-End Application Workflow

```mermaid
flowchart TD
    Start(\\\\\\\[User Opens App]) --> Title\\\\\\\[Title Screen: CAPTCHA FROM HELL]
    Title -->|Click Play Gauntlet| Stage0\\\\\\\[Stage 0: Checkbox Bait]
    Title -->|Click Options| OptModal\\\\\\\[Options: Sound, Shake, Reset]
    Title -->|Click Quit| QuitModal\\\\\\\[Surrender Dialogue]

    Stage0 -->|Human Click Signature| Alert\\\\\\\[Bait Alert Triggered]
    Alert --> Stage1\\\\\\\[Stage 1: Screaming Verification
≥ 80 dB for 3.0 continuous seconds]

    Stage1 -->|Pass Acoustic Check| Stage2\\\\\\\[Stage 2: Affirmations Grid
Identify 1 Human Statement among 15 AI Decoys]

    Stage2 -->|Correct Tile| Stage3\\\\\\\[Stage 3: Ultra-Speed Whack-a-Mole
Catch 4 Moles moving every \\\\\\\~0.35s]

    Stage3 -->|All 4 Stunned| Stage4\\\\\\\[Stage 4: Breakup Simulator
Maintain firm boundaries with Rias]

    Stage4 -->|Final Separation| Stage5\\\\\\\[Stage 5: Minecraft Wither Battle
40 Clicks in 4.0s]

    Stage5 -->|Nether Star Won| Stage6\\\\\\\[Stage 6: Authentic Beacon Crafting
5 Glass, 1 Star, 3 Obsidian in 3x3 Grid]

    Stage6 -->|Beacon to Hotbar| Stage7\\\\\\\[Stage 7: Happiness Exam
Webcam Facial Dopamine Calibration]

    Stage7 -->|Smile Calibrated| Stage8\\\\\\\[Stage 8: Moving Rim Free Throws
Kinetic Physics: 3 Consecutive Swishes]

    Stage8 -->|3 In A Row| Stage9\\\\\\\[Stage 9: Stock Market Valuation
Hold $ROBOT through 3 Pullbacks for $1,000 Dividend]

    Stage9 -->|Dividend Paid| Stage10\\\\\\\[Stage 10: Geometry Dash Sprint
Cube -> Upside-Down -> Mini -> Ship Flight]

    Stage10 -->|100% Finish Line| Loader\\\\\\\[3-Second Forensic Loader]
    Loader --> Dossier\\\\\\\[End Screen Dossier
Hardware Inspection \\\\\\\& Behavioral Roast]

    Dossier -->|Return to Title| Title
    Dossier -->|Restart Gauntlet| Stage0
```

# Core Module Details

## Procedural Audio Engine

* **Zero External Dependencies**: Synthesizes authentic arcade and game sound effects dynamically using math formulas and standard Web Audio oscillators.

  * **Error Buzzer**: Dual detuned sawtooth (`130 Hz`) and square (`136 Hz`) wave oscillators with linear downward glide.
  * **Bonk / Whack**: Triangle pitch frequency sweep (`240 Hz` down to `60 Hz`) with lowpass filtering.
  * **Basketball Rim Clank**: Inharmonic dual high-band resonant frequencies (`1150 Hz` \& `2380 Hz`) with metallic decay.
  * **Net Swish**: High-pass filtered white noise buffer with exponential release.
  * **GD Shatter Explosion**: 0.45s multi-sample noise burst with rapid decay envelope.
* **Custom Fail Audio**: Dedicated `playCustomFail()` method playing user-uploaded rage audio (`assets/audio/fail\\\\\\\_custom.mp3`) for Wither defeats and basketball misses.

## Real-time 2D Canvas Physics Loops

### Stage 8 (Basketball)

* Gravitational acceleration (`vy += 0.38`)
* Air resistance damping (`vx \\\\\\\*= 0.995`)
* Sinusoidal moving hoop oscillation (`RIM\\\\\\\_CENTER\\\\\\\_X + Math.sin(t \\\\\\\* speed) \\\\\\\* AMP`)
* Vector dot product elastic collision for circular rim pegs.

### Stage 10 (Geometry Dash Platformer)

* 60 FPS deterministic simulation running with sub-pixel interpolation.
* Parallax background wallpaper scrolling.
* Dual gravity modes (`gravityDir: 1` floor, `-1` ceiling).
* Ship continuous flight thrust vectors with dynamic exhaust jet animations.
* Pixel-perfect hitboxes with 5px inner hazard inset padding for fair play.

## Hardware Diagnostics \& Forensic Inspection

In the final **End Screen Dossier**, the browser queries live client telemetry:

* **GPU Hardware**: Extracted via `WEBGL\\\\\\\_debug\\\\\\\_renderer\\\\\\\_info` extension on an off-screen WebGL context.
* **CPU Rig**: Queried via `navigator.hardwareConcurrency`.
* **Battery**: Queried via `navigator.getBattery()`.
* **Display Metrics**: Queried via `window.screen.width`, `height`, and `devicePixelRatio`.
* **Interaction Logs**: Peak decibels (`screamMaxDb`), relationship failures (`breakupFailCount`), Wither deaths (`witherDeaths`), GD deaths (`gdDeaths`), and unhinged click counts (`rageClicks`).

# Screenshots (Add at least 3)

!\[Screenshot1](Add screenshot 1 here with proper name)
*Add caption explaining what this shows*

!\[Screenshot2](Add screenshot 2 here with proper name)
*Add caption explaining what this shows*

!\[Screenshot3](Add screenshot 3 here with proper name)
*Add caption explaining what this shows*

### Project Demo

# Video

\[Add your demo video link here]
*Explain what the video demonstrates*

# Additional Demos

\[Add any extra demo materials/links]

## Team Contributions

* Ramsankar B Komath: idea + ui + sound
* Neel A Ved: base model

\---

Made with ❤️ at TinkerHub Useless Projects

!\[Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000\&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
!\[Static Badge](https://img.shields.io/badge/UselessProjects--26-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)

