// Stage 3: Stunned Whack-a-Mole (Hyper-Speed 4 Moles Mode)
// 3x3 Burrow Grid with 4 lightning-fast moles darting through 9 holes.
// Ultra-rapid relocation (0.32s - 0.54s). Clicking stuns & locks them in place.
// Uses custom uploaded Diglett sprites (mole_normal.png & mole_stunned.png).

window.initStage3 = function(container, onComplete) {
  // 9 holes (0 to 8)
  const holes = Array.from({ length: 9 }, (_, i) => ({
    id: i,
    type: 'empty',
    moleId: null,
    timer: null
  }));

  // 4 moles to track (Extreme difficulty & speed)
  const TOTAL_MOLES = 4;
  const moles = Array.from({ length: TOTAL_MOLES }, (_, i) => ({
    id: i,
    holeId: null,
    isStunned: false
  }));

  let isCompleted = false;

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center p-3 sm:p-4 max-w-lg mx-auto w-full select-none">
      
      <!-- Header -->
      <div class="w-full bg-[#1c140d] border-2 border-amber-700/60 rounded-2xl p-4 sm:p-5 shadow-2xl text-center mb-4">
        <div class="inline-flex items-center space-x-2 px-3 py-0.5 bg-amber-950 border border-amber-600/50 rounded-full text-amber-400 text-xs font-mono mb-2">
          <span>STAGE 3 / 10: HYPER-SPEED REFLEX CALIBRATION</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-black text-amber-100 tracking-wide font-mono">
          Ultra-Speed Whack-a-Mole
        </h2>
        <p class="text-xs text-amber-300/80 mt-1 font-mono">
          Moles dart underground every <span class="text-yellow-400 font-bold">~0.35 seconds</span>! Catch all <span class="text-white font-bold">4 moles</span> to stun and lock them.
        </p>

        <!-- Progress Badges -->
        <div class="mt-3 flex items-center justify-center space-x-3">
          <div class="flex space-x-2" id="mole-stun-badges"></div>
          <span id="mole-count-text" class="text-xs font-mono font-bold text-amber-300">0 / 4 STUNNED</span>
        </div>
      </div>

      <!-- 3x3 Whack Grid -->
      <div class="w-full bg-[#291b10] p-4 sm:p-5 rounded-2xl border-4 border-amber-950 shadow-inner">
        <div id="holes-grid" class="grid grid-cols-3 gap-3 sm:gap-4 aspect-square max-w-[380px] mx-auto">
          <!-- 9 holes rendered here -->
        </div>
      </div>

      <div id="mole-instruction" class="mt-3 text-xs font-mono text-slate-400 text-center">
        ⚡ Extreme reflex test. Tap the instant a mole surfaces before it digs down!
      </div>
    </div>
  `;

  const gridEl = document.getElementById('holes-grid');
  const badgesEl = document.getElementById('mole-stun-badges');
  const countText = document.getElementById('mole-count-text');
  const instructionEl = document.getElementById('mole-instruction');

  function updateBadges() {
    const stunnedCount = moles.filter(m => m.isStunned).length;
    badgesEl.innerHTML = '';
    for (let i = 0; i < TOTAL_MOLES; i++) {
      const dot = document.createElement('div');
      dot.className = `w-5 h-5 rounded-full border-2 transition-all duration-300 ${
        i < stunnedCount ? 'bg-yellow-400 border-yellow-200 shadow-md shadow-yellow-400/70 scale-110' : 'bg-slate-800 border-slate-600'
      }`;
      badgesEl.appendChild(dot);
    }
    countText.textContent = `${stunnedCount} / ${TOTAL_MOLES} STUNNED`;
  }

  function renderHole(holeId) {
    const hole = holes[holeId];
    const holeEl = document.getElementById(`hole-${holeId}`);
    if (!holeEl) return;

    holeEl.innerHTML = `
      <!-- Hole Burrow Shadow -->
      <div class="absolute inset-x-2 bottom-1 h-7 bg-[#120a05] rounded-full border-b-2 border-amber-900 shadow-inner"></div>
      
      <!-- Mole Actor -->
      <div class="mole-actor absolute inset-0 flex items-center justify-center cursor-pointer select-none">
        ${
          hole.type === 'active'
            ? `<div class="w-20 h-20 sm:w-24 sm:h-24 hover:scale-105 active:scale-95 transition-transform animate-bounce">
                ${window.renderSprite('moleNormal', 'w-full h-full')}
               </div>`
            : hole.type === 'stunned'
            ? `<div class="w-20 h-20 sm:w-24 sm:h-24 filter drop-shadow-md">
                ${window.renderSprite('moleStunned', 'w-full h-full')}
               </div>`
            : ''
        }
      </div>
    `;

    const moleActor = holeEl.querySelector('.mole-actor');
    if (moleActor && hole.type === 'active') {
      moleActor.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        handleWhack(holeId);
      });
    }
  }

  function handleWhack(holeId) {
    if (isCompleted) return;
    const hole = holes[holeId];
    if (hole.type !== 'active') return;

    const mole = moles.find(m => m.id === hole.moleId);
    if (!mole) return;

    window.soundEngine.playBonk();

    if (hole.timer) clearTimeout(hole.timer);
    hole.timer = null;

    mole.isStunned = true;
    hole.type = 'stunned';
    renderHole(holeId);
    updateBadges();

    const stunnedCount = moles.filter(m => m.isStunned).length;
    if (stunnedCount >= TOTAL_MOLES) {
      isCompleted = true;
      cleanupTimers();
      window.soundEngine.playSuccessChime();
      instructionEl.textContent = '🎉 ALL 4 MOLES STUNNED! ADVANCING...';
      instructionEl.className = 'mt-3 text-xs font-mono font-bold text-emerald-400 text-center animate-pulse';

      setTimeout(() => {
        onComplete();
      }, 1200);
    }
  }

  function moveMole(moleId) {
    if (isCompleted) return;
    const mole = moles[moleId];
    if (mole.isStunned) return;

    // Clear old hole
    if (mole.holeId !== null) {
      const oldHole = holes[mole.holeId];
      if (oldHole.timer) clearTimeout(oldHole.timer);
      oldHole.type = 'empty';
      oldHole.moleId = null;
      renderHole(mole.holeId);
      mole.holeId = null;
    }

    // Find available empty holes
    const emptyHoles = holes.filter(h => h.type === 'empty');
    if (emptyHoles.length === 0) return;

    const targetHole = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];
    targetHole.type = 'active';
    targetHole.moleId = moleId;
    mole.holeId = targetHole.id;
    renderHole(targetHole.id);

    // Ultra-Fast relocation: 340ms to 560ms (lightning fast reaction window!)
    const fastDuration = 340 + Math.random() * 220;
    targetHole.timer = setTimeout(() => {
      moveMole(moleId);
    }, fastDuration);
  }

  function cleanupTimers() {
    holes.forEach(h => {
      if (h.timer) clearTimeout(h.timer);
      h.timer = null;
    });
  }

  // Build 9 holes
  gridEl.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const holeSlot = document.createElement('div');
    holeSlot.id = `hole-${i}`;
    holeSlot.className = 'relative bg-[#190f07] rounded-2xl overflow-hidden border-2 border-amber-900 shadow-md flex items-center justify-center h-24 sm:h-28';
    gridEl.appendChild(holeSlot);
    renderHole(i);
  }

  updateBadges();

  // Spawn 4 moles with lightning initial staggered timers
  const initialHoleIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5).slice(0, TOTAL_MOLES);
  moles.forEach((mole, idx) => {
    const holeId = initialHoleIndices[idx];
    const hole = holes[holeId];
    hole.type = 'active';
    hole.moleId = mole.id;
    mole.holeId = holeId;
    renderHole(holeId);

    // Stagger fast initial relocation: 260ms to 550ms
    hole.timer = setTimeout(() => {
      moveMole(mole.id);
    }, 260 + Math.random() * 290);
  });

  return cleanupTimers;
};
