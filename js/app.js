// Main Application Controller & Telemetry End Screen Renderer

const STAGES = [
  { id: 0, title: "Checkbox Bait", init: window.initStage0 },
  { id: 1, title: "Scream Test", init: window.initStage1 },
  { id: 2, title: "Affirmations Grid", init: window.initStage2 },
  { id: 3, title: "Whack-a-Mole", init: window.initStage3 },
  { id: 4, title: "Breakup Simulator", init: window.initStage4 },
  { id: 5, title: "Wither Boss CPS", init: window.initStage5 },
  { id: 6, title: "Beacon Crafting", init: window.initStage6 },
  { id: 7, title: "Facial Exam", init: window.initStage7 },
  { id: 8, title: "Free Throws", init: window.initStage8 },
  { id: 9, title: "Stock Crash", init: window.initStage9 },
  { id: 10, title: "Geometry Dash", init: window.initStage10 }
];

function updateHeaderUI(stageIndex) {
  const stageDots = document.getElementById('stage-stepper-dots');
  const stageTitleEl = document.getElementById('current-stage-title');
  const stageBadgeEl = document.getElementById('current-stage-badge');

  if (stageDots) {
    stageDots.innerHTML = STAGES.map((s, idx) => `
      <div class="transition-all duration-300 rounded-full ${
        idx === stageIndex
          ? 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-rose-500 border border-red-300 shadow-md shadow-red-500 scale-125 animate-pulse'
          : idx < stageIndex
          ? 'w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-900 border border-red-800'
          : 'w-1.5 h-1.5 sm:w-2 sm:h-2 bg-zinc-900 border border-zinc-800'
      }"></div>
    `).join('');
  }

  if (stageTitleEl) {
    stageTitleEl.textContent = `STAGE ${stageIndex}: ${STAGES[stageIndex].title.toUpperCase()}`;
  }

  if (stageBadgeEl) {
    stageBadgeEl.textContent = `${stageIndex + 1} / ${STAGES.length}`;
  }
}

let currentStageCleanup = null;

function loadStage(index) {
  if (typeof currentStageCleanup === 'function') {
    try { currentStageCleanup(); } catch (e) {}
    currentStageCleanup = null;
  }

  window.gameState.currentStage = index;
  const mainStageContainer = document.getElementById('stage-mount-point');
  if (!mainStageContainer) return;

  updateHeaderUI(index);
  mainStageContainer.innerHTML = '';

  const stage = STAGES[index];
  if (stage && typeof stage.init === 'function') {
    currentStageCleanup = stage.init(mainStageContainer, () => {
      // Stage completed callback
      if (index + 1 < STAGES.length) {
        loadStage(index + 1);
      } else {
        // Gauntlet finished! Show 3-second loader & End Screen Dossier
        showDiagnosticLoader();
      }
    });
  }
}

// 3-Second Diagnostics Loader
function showDiagnosticLoader() {
  if (typeof currentStageCleanup === 'function') {
    try { currentStageCleanup(); } catch (e) {}
    currentStageCleanup = null;
  }

  const mount = document.getElementById('stage-mount-point');
  const headerNav = document.getElementById('global-header-nav');
  if (headerNav) headerNav.classList.add('hidden');

  mount.innerHTML = `
    <div class="flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full min-h-[420px] select-none text-center">
      <div class="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
      
      <h2 class="text-xl sm:text-2xl font-black font-mono text-emerald-400 tracking-wider mb-2">
        Compiling Human Diagnostics...
      </h2>
      
      <p id="loader-status-ticker" class="text-xs font-mono text-slate-400 min-h-[20px] mb-6">
        Probing hardware registers & WebGL subsystem...
      </p>

      <!-- Progress Bar -->
      <div class="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700 max-w-md">
        <div id="loader-progress" class="h-full bg-emerald-500 rounded-full transition-all duration-300 w-0"></div>
      </div>
    </div>
  `;

  const statusTicker = document.getElementById('loader-status-ticker');
  const progressBar = document.getElementById('loader-progress');

  const steps = [
    { time: 600, pct: 25, msg: "Extracting CPU concurrency & GPU vendor string..." },
    { time: 1300, pct: 55, msg: "Evaluating acoustic lung capacity & scream dB..." },
    { time: 2000, pct: 80, msg: "Auditing codependent prompt attachments..." },
    { time: 2700, pct: 98, msg: "Generating behavioral satirical roast..." },
    { time: 3000, pct: 100, msg: "Compiling complete diagnostic dossier..." }
  ];

  steps.forEach(s => {
    setTimeout(() => {
      if (progressBar) progressBar.style.width = `${s.pct}%`;
      if (statusTicker) statusTicker.textContent = s.msg;
      window.soundEngine.playTerminalBeep();
    }, s.time);
  });

  setTimeout(async () => {
    const telemetry = await window.harvestTelemetry();
    renderTerminalEndScreen(telemetry);
  }, 3300);
}

// 4th-Wall-Breaking Telemetry End Screen (kuber.studio/cookie/ style)
function renderTerminalEndScreen(data) {
  const mount = document.getElementById('stage-mount-point');

  mount.innerHTML = `
    <div class="w-full max-w-3xl mx-auto p-2 sm:p-4">
      
      <!-- CRT Monitor Chassis -->
      <div class="crt-screen rounded-xl border-4 border-zinc-800 p-4 sm:p-8 shadow-2xl overflow-hidden relative">
        
        <!-- CRT Top Bar -->
        <div class="flex items-center justify-between border-b border-green-800/60 pb-3 mb-4 text-xs font-mono">
          <div class="flex items-center space-x-2">
            <span class="inline-block w-3 h-3 rounded-full bg-red-600"></span>
            <span class="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
            <span class="inline-block w-3 h-3 rounded-full bg-green-500"></span>
            <span class="ml-2 text-green-400 font-bold">TERMINAL://HUMAN_DIAGNOSTICS_V4.2</span>
          </div>
          <div class="text-[11px] text-green-600">
            SECURE_TELEMETRY_DUMP
          </div>
        </div>

        <!-- Terminal Output Pre/Code -->
        <pre id="terminal-content" class="text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-wrap select-text text-green-400 overflow-x-auto min-h-[380px]"></pre>

        <span class="terminal-cursor"></span>

        <!-- Terminal Interactive Actions -->
        <div id="terminal-actions" class="hidden mt-6 pt-4 border-t border-red-950 flex flex-wrap gap-3 items-center justify-between text-xs font-mono">
          <div class="flex space-x-2">
            <button id="btn-copy-dossier" class="px-4 py-2 bg-[#140608] hover:bg-[#240a0e] border border-red-950 text-zinc-300 rounded-xl cursor-pointer transition-all active:scale-95 shadow-md">
              📋 Copy Report
            </button>
            <button id="btn-download-dossier" class="px-4 py-2 bg-[#140608] hover:bg-[#240a0e] border border-red-950 text-zinc-300 rounded-xl cursor-pointer transition-all active:scale-95 shadow-md">
              💾 Download Dossier (.txt)
            </button>
          </div>
          
          <div class="flex space-x-2">
            <button id="btn-return-title" class="px-4 py-2 bg-[#1c080d] hover:bg-[#2e0e16] border border-red-900/80 text-rose-300 font-bold rounded-xl cursor-pointer transition-all active:scale-95 shadow-md">
              🏠 Return to Title Screen
            </button>
            <button id="btn-restart-gauntlet" class="px-5 py-2 bg-gradient-to-r from-red-800 to-rose-700 hover:from-red-700 hover:to-rose-600 border border-red-500/70 text-white font-bold rounded-xl cursor-pointer transition-all active:scale-95 shadow-lg shadow-red-950/60">
              🔄 Restart Gauntlet
            </button>
          </div>
        </div>

      </div>

    </div>
  `;

  // Build the exact required ASCII Telemetry Dossier text
  const reportText = `======================================================================
               HUMAN IDENTIFICATION & TELEMETRY REPORT                
======================================================================

1. HARDWARE & RIG DIAGNOSTICS
----------------------------------------------------------------------
• Operating System  : ${data.os}
• CPU Architecture  : ${data.cpuCores} Cores
• GPU Renderer      : ${data.gpuRenderer}
• Display Setup     : ${data.displaySetup}
• Battery Status    : ${data.batteryStatus}

2. NETWORK & METRIC TRACKING
----------------------------------------------------------------------
• Local Timezone    : ${data.timeZone}
• System Language   : ${data.language}
• Touch Points      : ${data.touchPoints}

3. STAGE PERFORMANCE & BEHAVIORAL ROAST
----------------------------------------------------------------------
• Scream Test (Stage 1) : Peak Volume ${data.screamMaxDb} dB. 
• Relationship Skill    : Stage 4 Failed ${data.breakupFailCount} Times. 
                          You hesitated and gave in to emotional guilt.
• Minecraft CPS Test    : Wither Deaths Logged: ${data.witherDeaths}.
• Basketball Skill      : High coordination under extreme wind conditions.
• Geometry Dash Sprint  : Crashes Logged: ${data.gdDeaths || 0}. Reflexes of a sleepy sloth.
• Rage Clicks Captured  : ${data.rageClicks} unhinged clicks recorded.

======================================================================
VERDICT: YOU ARE HUMAN.
A highly predictable, easily frustrated human who needs to go outside.
======================================================================`;

  const termPre = document.getElementById('terminal-content');
  const actionsBox = document.getElementById('terminal-actions');
  const btnCopy = document.getElementById('btn-copy-dossier');
  const btnDownload = document.getElementById('btn-download-dossier');
  const btnRestart = document.getElementById('btn-restart-gauntlet');
  const btnReturnTitle = document.getElementById('btn-return-title');

  // Typewriter line-by-line / character animation
  let charIdx = 0;
  const typeSpeed = 8; // ms per char

  function typeNext() {
    if (charIdx < reportText.length) {
      const chunk = reportText.slice(charIdx, charIdx + 4);
      termPre.textContent += chunk;
      charIdx += 4;

      if (charIdx % 32 === 0) {
        window.soundEngine.playTerminalBeep();
      }

      setTimeout(typeNext, typeSpeed);
    } else {
      termPre.textContent = reportText;
      actionsBox.classList.remove('hidden');
      window.soundEngine.playSuccessChime();
    }
  }

  typeNext();

  btnCopy.addEventListener('click', () => {
    navigator.clipboard.writeText(reportText);
    btnCopy.textContent = '✅ Copied to Clipboard!';
    setTimeout(() => {
      btnCopy.textContent = '📋 Copy Telemetry Report';
    }, 2000);
  });

  btnDownload.addEventListener('click', () => {
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `human_telemetry_dossier_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  });

  btnReturnTitle.addEventListener('click', () => {
    showTitleScreen();
  });

  btnRestart.addEventListener('click', () => {
    window.gameState.currentStage = 0;
    window.gameState.screamMaxDb = 0;
    window.gameState.breakupFailCount = 0;
    window.gameState.witherDeaths = 0;
    window.gameState.rageClicks = 0;
    window.gameState.gdDeaths = 0;
    window.gameState.timeStarted = Date.now();

    const headerNav = document.getElementById('global-header-nav');
    if (headerNav) headerNav.classList.remove('hidden');

    loadStage(0);
  });
}

// Title Screen with Play, Options, Quit (Powered by custom title_screen.png)
function showTitleScreen() {
  if (typeof currentStageCleanup === 'function') {
    try { currentStageCleanup(); } catch (e) {}
    currentStageCleanup = null;
  }

  const headerNav = document.getElementById('global-header-nav');
  if (headerNav) headerNav.classList.add('hidden');

  const mount = document.getElementById('stage-mount-point');
  if (!mount) return;

  mount.innerHTML = `
    <div class="flex flex-col items-center justify-center p-2 sm:p-4 max-w-4xl mx-auto w-full select-none text-center animate-fade-in">
      
      <!-- Hellfire Title Screen Card -->
      <div class="relative w-full aspect-[1024/584] rounded-3xl overflow-hidden shadow-2xl drop-shadow-[0_15px_35px_rgba(220,38,38,0.35)] border border-red-950/60">
        <!-- Base Artwork -->
        <img src="assets/images/title_screen.png" alt="Captcha From Hell Title" class="w-full h-full object-cover select-none pointer-events-none" />

        <!-- Interactive Hotspots directly over the 3 artwork buttons! -->
        <div class="absolute inset-0 pointer-events-auto">
          
          <!-- PLAY GAUNTLET HOTSPOT -->
          <button id="btn-menu-play" class="absolute top-[55.5%] left-[33.2%] w-[33.6%] h-[8.5%] rounded-xl transition-all cursor-pointer hover:ring-2 hover:ring-red-500/70 hover:bg-red-500/15 active:scale-[0.98] shadow-lg shadow-red-900/40" title="Play Gauntlet">
            <span class="sr-only">Play Gauntlet</span>
          </button>

          <!-- OPTIONS HOTSPOT -->
          <button id="btn-menu-options" class="absolute top-[65.8%] left-[33.2%] w-[33.6%] h-[8.5%] rounded-xl transition-all cursor-pointer hover:ring-2 hover:ring-red-400/60 hover:bg-white/10 active:scale-[0.98] shadow-md" title="Options">
            <span class="sr-only">Options</span>
          </button>

          <!-- QUIT HOTSPOT -->
          <button id="btn-menu-quit" class="absolute top-[75.2%] left-[33.2%] w-[33.6%] h-[8.5%] rounded-xl transition-all cursor-pointer hover:ring-2 hover:ring-red-600/70 hover:bg-red-950/30 active:scale-[0.98] shadow-md" title="Quit">
            <span class="sr-only">Quit</span>
          </button>

        </div>

        <!-- Options Modal Dialog (Hellfire & Obsidian Theme) -->
        <div id="options-modal" class="hidden absolute inset-0 bg-[#070203]/95 backdrop-blur-md p-6 flex flex-col justify-center items-center z-30 font-mono text-xs border-2 border-red-950/80">
          <h3 class="text-base font-black text-rose-500 mb-5 uppercase tracking-widest flex items-center space-x-2">
            <span>⚙️ SYSTEM CONFIGURATION</span>
          </h3>
          
          <div class="w-full max-w-xs space-y-3 text-left mb-6">
            <!-- Audio Toggle -->
            <div class="flex items-center justify-between p-2.5 bg-[#140608] rounded-lg border border-red-950">
              <span class="text-zinc-300">Sound Engine:</span>
              <button id="btn-opt-audio" class="px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded font-bold cursor-pointer transition-colors">
                ${window.soundEngine.muted ? 'MUTED' : 'ENABLED'}
              </button>
            </div>

            <!-- Shake Toggle -->
            <div class="flex items-center justify-between p-2.5 bg-[#140608] rounded-lg border border-red-950">
              <span class="text-zinc-300">Screen Shake:</span>
              <button id="btn-opt-shake" class="px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded font-bold cursor-pointer transition-colors">
                ENABLED
              </button>
            </div>

            <!-- Clear Records -->
            <div class="flex items-center justify-between p-2.5 bg-[#140608] rounded-lg border border-red-950">
              <span class="text-zinc-300">Clear Telemetry:</span>
              <button id="btn-opt-reset" class="px-3 py-1 bg-[#25080c] hover:bg-red-900 text-red-300 border border-red-900 rounded font-bold cursor-pointer transition-colors">
                RESET
              </button>
            </div>
          </div>

          <button id="btn-close-options" class="px-6 py-2 bg-[#1b080b] hover:bg-[#2d0e14] text-rose-200 border border-red-900 rounded-lg font-bold cursor-pointer transition-all">
            Close Settings
          </button>
        </div>

        <!-- Quit Confirmation Modal (Hellfire & Obsidian Theme) -->
        <div id="quit-modal" class="hidden absolute inset-0 bg-[#070203]/95 backdrop-blur-md p-6 flex flex-col justify-center items-center z-30 font-mono text-center border-2 border-red-950/80">
          <div class="text-3xl mb-2">🔥</div>
          <h3 class="text-base font-black text-rose-500 mb-2 uppercase tracking-wide">SURRENDER TO THE GAUNTLET?</h3>
          <p class="text-xs text-zinc-400 mb-6 max-w-xs leading-relaxed">
            "Only a synthetic entity lacking human resolve would abandon the trials before the first flame."
          </p>
          <div class="flex space-x-3">
            <button id="btn-cancel-quit" class="px-5 py-2.5 bg-red-700 hover:bg-red-600 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-md">
              Face The Fire
            </button>
            <button id="btn-confirm-quit" class="px-5 py-2.5 bg-[#180609] border border-red-900 text-red-400 text-xs font-bold rounded-xl hover:bg-red-950 cursor-pointer transition-all">
              I Am But A Bot
            </button>
          </div>
        </div>

      </div>

    </div>
  `;

  // Bind Menu Hotspots
  document.getElementById('btn-menu-play')?.addEventListener('click', () => {
    headerNav.classList.remove('hidden');
    loadStage(0);
  });

  const optModal = document.getElementById('options-modal');
  document.getElementById('btn-menu-options')?.addEventListener('click', () => {
    optModal.classList.remove('hidden');
  });
  document.getElementById('btn-close-options')?.addEventListener('click', () => {
    optModal.classList.add('hidden');
  });

  const btnOptAudio = document.getElementById('btn-opt-audio');
  btnOptAudio?.addEventListener('click', () => {
    const isMuted = window.soundEngine.toggleMute();
    btnOptAudio.textContent = isMuted ? 'MUTED' : 'ENABLED';
    btnOptAudio.className = isMuted ? 'px-3 py-1 bg-zinc-800 text-zinc-400 rounded font-bold cursor-pointer' : 'px-3 py-1 bg-red-700 text-white rounded font-bold cursor-pointer';
    const headerAudioTxt = document.getElementById('btn-toggle-sound-text');
    if (headerAudioTxt) headerAudioTxt.textContent = isMuted ? '🔇 AUDIO: OFF' : '🔊 AUDIO: ON';
  });

  const btnOptShake = document.getElementById('btn-opt-shake');
  let shakeActive = true;
  btnOptShake?.addEventListener('click', () => {
    shakeActive = !shakeActive;
    btnOptShake.textContent = shakeActive ? 'ENABLED' : 'DISABLED';
    btnOptShake.className = shakeActive ? 'px-3 py-1 bg-red-700 text-white rounded font-bold cursor-pointer' : 'px-3 py-1 bg-zinc-800 text-zinc-400 rounded font-bold cursor-pointer';
    if (!shakeActive) {
      document.body.classList.add('no-shake');
    } else {
      document.body.classList.remove('no-shake');
    }
  });

  document.getElementById('btn-opt-reset')?.addEventListener('click', () => {
    window.gameState.breakupFailCount = 0;
    window.gameState.witherDeaths = 0;
    window.gameState.rageClicks = 0;
    window.gameState.gdDeaths = 0;
    window.gameState.screamMaxDb = 0;
    alert('All telemetry stats have been cleared.');
  });

  const quitModal = document.getElementById('quit-modal');
  document.getElementById('btn-menu-quit')?.addEventListener('click', () => {
    quitModal.classList.remove('hidden');
  });
  document.getElementById('btn-cancel-quit')?.addEventListener('click', () => {
    quitModal.classList.add('hidden');
  });
  document.getElementById('btn-confirm-quit')?.addEventListener('click', () => {
    mount.innerHTML = `
      <div class="flex flex-col items-center justify-center p-8 text-center font-mono animate-fade-in">
        <h2 class="text-2xl font-bold text-red-500 mb-2">SESSION TERMINATED</h2>
        <p class="text-xs text-zinc-400 mb-5">Subject abandoned verification. Classification: SYNTHETIC ENTITY.</p>
        <button onclick="showTitleScreen()" class="px-5 py-2.5 bg-[#1b080b] hover:bg-[#2d0e14] text-rose-300 border border-red-900 rounded-xl text-xs font-bold cursor-pointer">
          Reboot Gauntlet
        </button>
      </div>
    `;
  });
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  const muteBtn = document.getElementById('btn-toggle-sound');
  const muteTxt = document.getElementById('btn-toggle-sound-text');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      const isMuted = window.soundEngine.toggleMute();
      if (muteTxt) {
        muteTxt.textContent = isMuted ? '🔇 AUDIO: OFF' : '🔊 AUDIO: ON';
      }
    });
  }

  // Load Title Screen first
  showTitleScreen();
});
window.showTitleScreen = showTitleScreen;

