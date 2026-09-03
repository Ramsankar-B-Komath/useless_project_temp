// Stage 5: Minecraft Wither Boss (CPS Test)
// 8 CPS test (40 clicks in 5 seconds).
// Failure triggers Minecraft Death screen ("You were slain by The Wither", loud "Faaaahh" sound).
// Success awards SPRITES.netherStar into player's active inventory for Stage 6.

window.initStage5 = function(container, onComplete) {
  let clicks = 0;
  const TARGET_CLICKS = 40;
  const TOTAL_TIME = 5.0; // 5 seconds
  let timeLeft = TOTAL_TIME;
  let timerInterval = null;
  let started = false;
  let finished = false;

  function renderArena() {
    clicks = 0;
    timeLeft = TOTAL_TIME;
    started = false;
    finished = false;
    if (timerInterval) clearInterval(timerInterval);

    container.innerHTML = `
      <div class="flex flex-col items-center justify-center p-3 sm:p-4 max-w-xl mx-auto w-full select-none">
        
        <!-- Nether Dark Sky Box -->
        <div class="w-full bg-[#180a14] border-4 border-[#3b122b] rounded-xl p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col items-center min-h-[480px]">
          
          <!-- Minecraft Boss Bar -->
          <div class="w-full max-w-md mb-6">
            <div class="flex justify-between items-center text-xs font-mono text-purple-300 font-bold mb-1">
              <span class="tracking-widest">WITHER</span>
              <span id="wither-hp-text">300 / 300 HP</span>
            </div>
            <!-- Boss Health Bar Container -->
            <div class="w-full h-4 bg-purple-950 border-2 border-purple-400/80 rounded-sm p-0.5 relative">
              <div id="wither-hp-bar" class="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-xs transition-all duration-75 w-full"></div>
            </div>
          </div>

          <!-- Timer & CPS HUD -->
          <div class="flex items-center justify-between w-full max-w-md px-2 text-xs font-mono mb-4 text-slate-300">
            <div class="flex items-center space-x-1">
              <span class="text-slate-400">TIME REMAINING:</span>
              <span id="wither-timer" class="text-yellow-400 font-bold text-sm">5.00s</span>
            </div>
            <div class="flex items-center space-x-1">
              <span class="text-slate-400">CLICKS:</span>
              <span id="click-counter" class="text-emerald-400 font-bold text-sm">0 / 40</span>
              <span class="text-slate-500 text-[10px]">(≥ 8 CPS)</span>
            </div>
          </div>

          <!-- Wither Boss Interactive Arena Area -->
          <div class="flex-1 flex flex-col items-center justify-center relative w-full my-4">
            
            <!-- Floating Particle Container -->
            <div id="particle-field" class="absolute inset-0 pointer-events-none overflow-hidden"></div>

            <!-- The Wither Target -->
            <button id="btn-hit-wither" class="relative group cursor-pointer focus:outline-none transition-transform active:scale-90 p-4">
              <div id="wither-sprite-box" class="w-44 h-36 sm:w-56 sm:h-44 wither-float transition-filter duration-75">
                ${window.renderSprite('witherBoss', 'w-full h-full')}
              </div>
              <!-- Start Prompt Overlay -->
              <div id="start-hint" class="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl border border-dashed border-purple-500/50">
                <span class="text-xs font-mono font-bold text-purple-200 uppercase tracking-wide px-3 py-1 bg-purple-900/80 rounded shadow">
                  Click Boss to Begin CPS Test
                </span>
              </div>
            </button>

          </div>

          <!-- Footer Instructions -->
          <div class="text-center text-[11px] font-mono text-slate-400 mt-2">
            Spam click anywhere on the Wither! Need <span class="text-yellow-300 font-bold">40 clicks in 5 seconds</span> to survive.
          </div>

          <!-- Minecraft Death Screen Overlay -->
          <div id="mc-death-screen" class="hidden absolute inset-0 bg-red-950/95 z-30 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <h1 class="text-3xl sm:text-4xl font-black text-red-500 font-mono tracking-widest mb-2 shadow-red-900">
              You died!
            </h1>
            <p class="text-sm font-mono text-slate-300 mb-2">
              You were slain by The Wither
            </p>
            <p class="text-xs font-mono text-yellow-500 mb-6">
              Score: 0 &bull; Clicks recorded: <span id="death-clicks-val">0</span>/40
            </p>
            <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button id="btn-respawn" class="mc-btn px-6 py-2 text-sm uppercase tracking-wider rounded-none cursor-pointer">
                Respawn
              </button>
            </div>
          </div>

          <!-- Victory Nether Star Award Overlay -->
          <div id="wither-victory-screen" class="hidden absolute inset-0 bg-purple-950/95 z-30 flex flex-col items-center justify-center p-6 text-center">
            <h2 class="text-2xl font-black text-white font-mono mb-2">WITHER SLAIN!</h2>
            <div class="w-24 h-24 my-3 filter drop-shadow-[0_0_20px_#a855f7] star-spin-fx">
              ${window.renderSprite('netherStar', 'w-full h-full')}
            </div>
            <p class="text-xs font-mono text-cyan-300 font-bold mb-4">
              Nether Star collected & stored in inventory!
            </p>
            <div class="text-[11px] font-mono text-slate-400">
              Advancing to Crafting Table...
            </div>
          </div>

        </div>
      </div>
    `;

    const btnHit = document.getElementById('btn-hit-wither');
    const startHint = document.getElementById('start-hint');
    const witherSpriteBox = document.getElementById('wither-sprite-box');
    const witherHpBar = document.getElementById('wither-hp-bar');
    const witherHpText = document.getElementById('wither-hp-text');
    const timerEl = document.getElementById('wither-timer');
    const clickCounter = document.getElementById('click-counter');
    const deathScreen = document.getElementById('mc-death-screen');
    const deathClicksVal = document.getElementById('death-clicks-val');
    const respawnBtn = document.getElementById('btn-respawn');
    const victoryScreen = document.getElementById('wither-victory-screen');

    respawnBtn.addEventListener('click', () => {
      renderArena();
    });

    btnHit.addEventListener('pointerdown', (e) => {
      if (finished) return;

      if (!started) {
        started = true;
        startHint.classList.add('hidden');
        startCountdown();
      }

      clicks++;
      clickCounter.textContent = `${clicks} / ${TARGET_CLICKS}`;

      // Update HP
      const hpRemaining = Math.max(0, Math.round(((TARGET_CLICKS - clicks) / TARGET_CLICKS) * 300));
      witherHpText.textContent = `${hpRemaining} / 300 HP`;
      const hpPct = Math.max(0, ((TARGET_CLICKS - clicks) / TARGET_CLICKS) * 100);
      witherHpBar.style.width = `${hpPct}%`;

      // Visual Damage Flash
      witherSpriteBox.style.filter = 'drop-shadow(0 0 15px #ef4444) brightness(1.6) sepia(1) hue-rotate(-50deg)';
      setTimeout(() => {
        witherSpriteBox.style.filter = 'none';
      }, 60);

      // Hit Audio
      window.soundEngine.playMinecraftHit();

      // Spawn damage particles
      spawnDamageCrit(e.clientX, e.clientY);

      // Check for win
      if (clicks >= TARGET_CLICKS) {
        handleVictory();
      }
    });

    function startCountdown() {
      const startTime = performance.now();
      timerInterval = setInterval(() => {
        if (finished) return;
        const elapsed = (performance.now() - startTime) / 1000;
        timeLeft = Math.max(0, TOTAL_TIME - elapsed);
        timerEl.textContent = `${timeLeft.toFixed(2)}s`;

        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          if (clicks < TARGET_CLICKS) {
            handleDeath();
          }
        }
      }, 25);
    }

    function handleDeath() {
      finished = true;
      clearInterval(timerInterval);

      // Log death
      window.gameState.witherDeaths++;

      // Play custom uploaded fail sound!
      window.soundEngine.playCustomFail();

      deathClicksVal.textContent = clicks;
      deathScreen.classList.remove('hidden');
    }

    function handleVictory() {
      finished = true;
      clearInterval(timerInterval);

      // Play level-up chime!
      window.soundEngine.playLevelUp();
      victoryScreen.classList.remove('hidden');

      setTimeout(() => {
        onComplete();
      }, 1800);
    }

    function spawnDamageCrit(x, y) {
      const field = document.getElementById('particle-field');
      if (!field) return;
      const crit = document.createElement('div');
      crit.className = 'absolute text-xs font-mono font-black text-amber-400 pointer-events-none animate-ping';
      crit.style.left = `${Math.random() * 80 + 10}%`;
      crit.style.top = `${Math.random() * 60 + 20}%`;
      crit.textContent = '🗡️ -15';
      field.appendChild(crit);
      setTimeout(() => crit.remove(), 400);
    }
  }

  renderArena();

  return function cleanup() {
    if (timerInterval) clearInterval(timerInterval);
  };
};
