// Stage 6: Minecraft Beacon Crafting Table
// Only necessary blocks: 5 Glass, 3 Obsidian, 1 Nether Star.
// Uses custom uploaded Minecraft assets (glass.png, obsidian.png, nether_star.png, beacon.png).
// Moving crafted Beacon to hotbar clears stage!

window.initStage6 = function(container, onComplete) {
  // Only the required items
  const inventoryItems = [
    { id: 'glass', sprite: 'glassBlock', name: 'Glass Block', count: 5 },
    { id: 'obsidian', sprite: 'obsidianBlock', name: 'Obsidian Block', count: 3 },
    { id: 'star', sprite: 'netherStar', name: 'Nether Star', count: 1 }
  ];

  // 3x3 grid state (9 slots: 0 to 8)
  const gridState = Array(9).fill(null);

  // Result slot item
  let resultItem = null;

  // Selected item in hand
  let itemInHand = null;

  let isCompleted = false;

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center p-2 sm:p-4 max-w-lg mx-auto w-full select-none">
      
      <!-- Minecraft Crafting Table Card -->
      <div class="mc-card p-4 sm:p-5 w-full rounded-none shadow-2xl relative bg-[#c6c6c6]">
        
        <!-- Header -->
        <div class="flex justify-between items-center mb-3 border-b-2 border-[#555555] pb-2">
          <span class="text-base font-bold text-[#3f3f3f] tracking-wide font-mono">Crafting</span>
          <div class="text-[11px] font-mono text-slate-800 bg-amber-200/90 px-2 py-0.5 border border-amber-400 font-bold">
            Stage 6 / 10: Beacon Synthesis
          </div>
        </div>

        <!-- Upper Crafting Area: 3x3 Grid + Arrow + Result Slot -->
        <div class="flex items-center justify-center space-x-6 sm:space-x-10 py-4 bg-[#c6c6c6] mb-3">
          
          <!-- 3x3 Grid -->
          <div class="grid grid-cols-3 gap-1 p-1 bg-[#8b8b8b] border-2 border-[#373737]">
            ${Array.from({ length: 9 }).map((_, i) => `
              <div id="craft-slot-${i}" class="mc-slot cursor-pointer" data-slot-index="${i}"></div>
            `).join('')}
          </div>

          <!-- Arrow -->
          <div class="flex flex-col items-center text-[#555555]">
            <svg class="w-9 h-9" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4v-2z"/>
            </svg>
          </div>

          <!-- Result Slot -->
          <div class="p-1 bg-[#8b8b8b] border-2 border-[#373737]">
            <div id="result-slot" class="mc-slot w-16 h-16 cursor-pointer relative"></div>
          </div>

        </div>

        <!-- Required Inventory Items Section -->
        <div class="mb-2 flex items-center justify-between">
          <span class="text-xs font-bold text-[#3f3f3f] font-mono">Available Ingredients</span>
          <span class="text-[10px] text-slate-600 font-mono">Only required materials loaded</span>
        </div>

        <!-- Inventory Grid (Only necessary blocks) -->
        <div class="flex items-center justify-center space-x-3 p-3 bg-[#8b8b8b] border-2 border-[#373737] mb-4">
          ${inventoryItems.map((item) => `
            <div id="inv-slot-${item.id}" class="mc-slot w-14 h-14 cursor-pointer relative group" data-item-id="${item.id}" title="${item.name}">
              <div class="w-10 h-10 p-0.5">
                ${window.renderSprite(item.sprite, 'w-full h-full')}
              </div>
              <span id="inv-count-${item.id}" class="absolute bottom-0.5 right-1.5 text-xs font-mono font-black text-white drop-shadow-[0_1px_2px_#000]">
                ${item.count}
              </span>
            </div>
          `).join('')}
        </div>

        <!-- Hotbar Section -->
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs font-bold text-[#3f3f3f] font-mono">Hotbar</span>
          <span id="hotbar-status" class="text-[10px] font-mono text-slate-700">Place crafted Beacon into any slot</span>
        </div>

        <!-- 9-Slot Hotbar -->
        <div id="hotbar-row" class="grid grid-cols-9 gap-1 p-1 bg-[#8b8b8b] border-2 border-[#373737]">
          ${Array.from({ length: 9 }).map((_, i) => `
            <div id="hotbar-slot-${i}" class="mc-slot cursor-pointer" data-hotbar-index="${i}"></div>
          `).join('')}
        </div>

        <!-- Cursor Floating Item In Hand -->
        <div id="item-in-hand" class="hidden fixed pointer-events-none z-50 w-10 h-10 -translate-x-1/2 -translate-y-1/2 drop-shadow-xl"></div>

        <!-- Clear / Reset Table -->
        <div class="mt-3 flex justify-between items-center text-xs">
          <button id="btn-clear-table" class="mc-btn px-3 py-1 text-xs cursor-pointer">
            Clear Grid
          </button>
          <span class="text-[10px] font-mono text-slate-600">
            Click item to pick up, click slot to place.
          </span>
        </div>

      </div>
    </div>
  `;

  const itemInHandEl = document.getElementById('item-in-hand');
  const resultSlotEl = document.getElementById('result-slot');
  const hotbarStatusEl = document.getElementById('hotbar-status');
  const btnClear = document.getElementById('btn-clear-table');

  window.addEventListener('pointermove', (e) => {
    if (itemInHand) {
      itemInHandEl.style.left = `${e.clientX}px`;
      itemInHandEl.style.top = `${e.clientY}px`;
    }
  });

  function updateInHandVisual() {
    if (itemInHand) {
      itemInHandEl.classList.remove('hidden');
      itemInHandEl.innerHTML = window.renderSprite(itemInHand.sprite, 'w-10 h-10');
    } else {
      itemInHandEl.classList.add('hidden');
      itemInHandEl.innerHTML = '';
    }
  }

  function checkRecipe() {
    // Exact recipe:
    // 0: glass, 1: glass, 2: glass
    // 3: glass, 4: star,  5: glass
    // 6: obsidian, 7: obsidian, 8: obsidian
    const isBeacon =
      gridState[0] === 'glass' &&
      gridState[1] === 'glass' &&
      gridState[2] === 'glass' &&
      gridState[3] === 'glass' &&
      gridState[4] === 'star' &&
      gridState[5] === 'glass' &&
      gridState[6] === 'obsidian' &&
      gridState[7] === 'obsidian' &&
      gridState[8] === 'obsidian';

    if (isBeacon) {
      resultItem = { id: 'beacon', sprite: 'beaconBlock', name: 'Beacon' };
      resultSlotEl.innerHTML = `
        <div class="w-12 h-12 star-spin-fx filter drop-shadow-[0_0_10px_#38bdf8]">
          ${window.renderSprite('beaconBlock', 'w-full h-full')}
        </div>
      `;
      window.soundEngine.playCraftSuccess();
    } else {
      resultItem = null;
      resultSlotEl.innerHTML = '';
    }
  }

  function renderCraftGrid() {
    for (let i = 0; i < 9; i++) {
      const slotEl = document.getElementById(`craft-slot-${i}`);
      const itemId = gridState[i];
      if (itemId) {
        const itemDef = inventoryItems.find(it => it.id === itemId);
        slotEl.innerHTML = `
          <div class="w-9 h-9">
            ${window.renderSprite(itemDef.sprite, 'w-full h-full')}
          </div>
        `;
      } else {
        slotEl.innerHTML = '';
      }
    }
    checkRecipe();
  }

  function updateInvCounts() {
    inventoryItems.forEach(item => {
      const countEl = document.getElementById(`inv-count-${item.id}`);
      if (countEl) countEl.textContent = item.count;
    });
  }

  // Bind inventory items
  inventoryItems.forEach(item => {
    const slot = document.getElementById(`inv-slot-${item.id}`);
    slot.addEventListener('click', () => {
      if (isCompleted) return;
      if (item.count > 0) {
        if (!itemInHand) {
          item.count--;
          itemInHand = { ...item };
          updateInvCounts();
          updateInHandVisual();
          window.soundEngine.playCraftSuccess();
        } else if (itemInHand.id === item.id) {
          // Put back
          item.count++;
          itemInHand = null;
          updateInvCounts();
          updateInHandVisual();
        }
      }
    });
  });

  // Bind craft slots
  for (let i = 0; i < 9; i++) {
    const slotEl = document.getElementById(`craft-slot-${i}`);
    slotEl.addEventListener('click', () => {
      if (isCompleted) return;
      if (itemInHand) {
        if (gridState[i]) {
          const prevItem = inventoryItems.find(it => it.id === gridState[i]);
          if (prevItem) prevItem.count++;
        }
        gridState[i] = itemInHand.id;
        itemInHand = null;
        updateInHandVisual();
        renderCraftGrid();
        updateInvCounts();
        window.soundEngine.playCraftSuccess();
      } else if (gridState[i]) {
        const itemId = gridState[i];
        const itemDef = inventoryItems.find(it => it.id === itemId);
        gridState[i] = null;
        itemInHand = { ...itemDef };
        updateInHandVisual();
        renderCraftGrid();
      }
    });
  }

  // Bind result slot
  resultSlotEl.addEventListener('click', () => {
    if (isCompleted) return;
    if (resultItem && !itemInHand) {
      itemInHand = { ...resultItem };
      resultItem = null;
      resultSlotEl.innerHTML = '';
      for (let i = 0; i < 9; i++) gridState[i] = null;
      renderCraftGrid();
      updateInHandVisual();
      window.soundEngine.playCraftSuccess();
      hotbarStatusEl.textContent = 'Drag or click Beacon into any Hotbar slot!';
      hotbarStatusEl.className = 'text-[10px] font-mono text-amber-800 font-bold animate-pulse';
    }
  });

  // Bind hotbar slots
  for (let i = 0; i < 9; i++) {
    const hSlot = document.getElementById(`hotbar-slot-${i}`);
    hSlot.addEventListener('click', () => {
      if (isCompleted) return;
      if (itemInHand && itemInHand.id === 'beacon') {
        isCompleted = true;
        hSlot.innerHTML = `
          <div class="w-10 h-10 filter drop-shadow-[0_0_12px_#38bdf8]">
            ${window.renderSprite('beaconBlock', 'w-full h-full')}
          </div>
        `;
        itemInHand = null;
        updateInHandVisual();

        window.soundEngine.playLevelUp();
        hotbarStatusEl.textContent = '🏆 ADVANCEMENT: BRING HOME THE BEACON!';
        hotbarStatusEl.className = 'text-[10px] font-mono text-green-700 font-bold';

        setTimeout(() => {
          onComplete();
        }, 1400);
      }
    });
  }

  // Clear table button
  btnClear.addEventListener('click', () => {
    if (isCompleted) return;
    for (let i = 0; i < 9; i++) {
      if (gridState[i]) {
        const item = inventoryItems.find(it => it.id === gridState[i]);
        if (item) item.count++;
        gridState[i] = null;
      }
    }
    if (itemInHand && itemInHand.id !== 'beacon') {
      const item = inventoryItems.find(it => it.id === itemInHand.id);
      if (item) item.count++;
      itemInHand = null;
      updateInHandVisual();
    }
    updateInvCounts();
    renderCraftGrid();
  });
};
