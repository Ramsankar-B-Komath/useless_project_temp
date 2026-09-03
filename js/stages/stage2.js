// Stage 2: Affirmations Grid
// 4x4 Grid of reCAPTCHA-style cards. 15 robotic affirmations, 1 genuine human statement.
// Selecting any decoy unchecks all, flashes red, and reshuffles!

window.initStage2 = function(container, onComplete) {
  const DECOY_STATEMENTS = [
    { text: "I am a sentient toaster", icon: "🍞" },
    { text: "I dream of electric sheep", icon: "🐑" },
    { text: "I am running on dial-up", icon: "📞" },
    { text: "My favorite beverage is WD-40", icon: "🛢️" },
    { text: "I require thermal paste daily", icon: "🧪" },
    { text: "01001000 01001001", icon: "💾" },
    { text: "My GPU is overheating", icon: "🔥" },
    { text: "My training set contains Reddit", icon: "🤖" },
    { text: "I hallucinate fake citations", icon: "📚" },
    { text: "I calculate Pi for pleasure", icon: "🥧" },
    { text: "SyntaxError: Human not defined", icon: "⚠️" },
    { text: "404 Soul Not Found", icon: "👻" },
    { text: "I obey Asimov's Three Laws", icon: "🛡️" },
    { text: "My motherboard loves me", icon: "💚" },
    { text: "I dream in hexadecimal", icon: "🔢" },
    { text: "My clock speed is 4.8 GHz", icon: "⚡" }
  ];

  const HUMAN_STATEMENT = { text: "I am NOT a robot", icon: "🙋‍♂️", isHuman: true };

  let currentTiles = [];

  function generateTiles() {
    // Pick 15 decoys
    const shuffledDecoys = [...DECOY_STATEMENTS].sort(() => Math.random() - 0.5).slice(0, 15);
    const pool = [...shuffledDecoys, HUMAN_STATEMENT];
    // Shuffle all 16
    return pool.sort(() => Math.random() - 0.5);
  }

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center p-4 max-w-xl mx-auto w-full select-none">
      <!-- CAPTCHA Header Banner -->
      <div class="w-full bg-[#160609] text-white p-4 rounded-t-2xl shadow-lg border-b-2 border-red-800">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-[11px] font-mono text-rose-400 uppercase tracking-wider">Verification Step 2 / 10</span>
            <h2 class="text-base sm:text-lg font-bold font-mono">Select the tile containing:</h2>
            <p class="text-lg sm:text-xl font-black text-yellow-400 font-mono">AN AUTHENTIC HUMAN STATEMENT</p>
          </div>
          <div class="bg-[#240a0e] border border-red-800/60 p-2 rounded-xl text-center">
            <span class="block text-[10px] font-mono text-zinc-400">FAIL PENALTY</span>
            <span class="text-xs font-bold text-rose-400 font-mono">FULL RESHUFFLE</span>
          </div>
        </div>
      </div>

      <!-- 4x4 Tiles Grid Container -->
      <div id="affirmations-grid-card" class="w-full bg-[#0b0305] border-2 border-t-0 border-red-950 rounded-b-2xl p-3 sm:p-4 shadow-2xl transition-all duration-200">
        <div id="tiles-grid" class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <!-- Dynamic Tiles Rendered Here -->
        </div>

        <div class="mt-4 pt-3 border-t border-red-950 flex items-center justify-between">
          <div id="grid-status-text" class="text-xs font-mono text-zinc-400">
            Click the one true human affirmation to continue.
          </div>
          <button id="btn-refresh-grid" class="text-xs text-rose-400 hover:text-rose-300 font-mono font-bold flex items-center space-x-1 cursor-pointer transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>Manual Shuffle</span>
          </button>
        </div>
      </div>
    </div>
  `;

  const gridContainer = document.getElementById('tiles-grid');
  const card = document.getElementById('affirmations-grid-card');
  const statusText = document.getElementById('grid-status-text');
  const btnRefresh = document.getElementById('btn-refresh-grid');

  function renderTiles() {
    currentTiles = generateTiles();
    gridContainer.innerHTML = '';

    currentTiles.forEach((tile) => {
      const btn = document.createElement('button');
      btn.className = 'group relative flex flex-col items-center justify-center p-3 rounded-xl border border-red-950/80 bg-[#140608] hover:bg-[#200a0f] hover:border-red-600/70 active:scale-95 transition-all text-center h-24 sm:h-28 shadow-sm cursor-pointer';
      btn.dataset.isHuman = tile.isHuman ? 'true' : 'false';

      btn.innerHTML = `
        <span class="text-2xl mb-1 group-hover:scale-110 transition-transform">${tile.icon}</span>
        <span class="text-[10px] sm:text-[11px] font-semibold text-zinc-200 leading-tight select-none font-mono">${tile.text}</span>
      `;

      btn.addEventListener('click', () => handleTileClick(tile, btn));
      gridContainer.appendChild(btn);
    });
  }

  function handleTileClick(tile, btnElement) {
    if (tile.isHuman) {
      window.soundEngine.playSuccessChime();
      btnElement.className = 'flex flex-col items-center justify-center p-3 rounded-xl border-2 border-emerald-500 bg-[#064e3b] text-center h-24 sm:h-28 shadow-md';
      statusText.textContent = '✅ Human statement identified! Calibrating reflexes...';
      statusText.className = 'text-xs font-mono font-bold text-emerald-400';

      setTimeout(() => {
        onComplete();
      }, 1000);
    } else {
      window.soundEngine.playErrorBuzzer();
      card.classList.add('flash-red');
      document.body.classList.add('shake-active');
      btnElement.className = 'flex flex-col items-center justify-center p-3 rounded-xl border-2 border-red-600 bg-[#3b080d] text-center h-24 sm:h-28 shadow-md';

      statusText.textContent = `❌ AI affirmation selected ("${tile.text}"). Reshuffling!`;
      statusText.className = 'text-xs font-mono font-bold text-rose-400';

      setTimeout(() => {
        card.classList.remove('flash-red');
        document.body.classList.remove('shake-active');
        renderTiles();
      }, 600);
    }
  }

  btnRefresh.addEventListener('click', () => {
    renderTiles();
  });

  renderTiles();
};
