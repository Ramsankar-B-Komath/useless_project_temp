// Stage 9: Stock Market ($ROBOT) - Realistic Market Simulation
// Normal organic price fluctuations with natural dips and highs (no random sabotages).
// BUY and SELL execute normally at market price.
// Pass condition: Holding the position without selling through 3 market dips triggers auto-dividend hitting $1,000.

window.initStage9 = function(container, onComplete) {
  let price = 100.00;
  let prevPrice = 100.00;
  let priceHistory = [];
  const MAX_POINTS = 65;

  // Initial price history
  for (let i = 0; i < MAX_POINTS; i++) {
    priceHistory.push(100.00 + (Math.sin(i * 0.15) * 3) + (Math.random() * 1.5 - 0.75));
  }

  let shares = 1;
  let cash = 50.00;
  let dipsSurvived = 0;
  const TARGET_DIPS = 3;
  let isDipActive = false;
  let isCompleted = false;

  let marketTimer = null;
  let tickInterval = null;
  let animFrameId = null;

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center p-2 sm:p-4 max-w-2xl mx-auto w-full select-none">
      
      <!-- Financial Terminal Card -->
      <div class="w-full bg-[#0a0406] border-2 border-red-950/80 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-red-950 pb-3 mb-4">
          <div>
            <div class="inline-flex items-center space-x-2 px-2.5 py-0.5 bg-[#170609] border border-red-900/60 rounded-full text-rose-300 text-[11px] font-mono mb-1">
              <span>STAGE 9 / 10: ASSET VALUATION</span>
            </div>
            <h2 class="text-lg sm:text-xl font-black text-white flex items-center space-x-2 font-mono">
              <span class="text-emerald-400">$ROBOT</span>
              <span class="text-xs px-2 py-0.5 bg-[#170609] text-zinc-400 font-normal rounded border border-red-950">Common Stock</span>
            </h2>
          </div>

          <!-- Dips Survived Counter -->
          <div class="text-right font-mono">
            <span class="text-[10px] text-zinc-400 block uppercase">Corrections Navigated</span>
            <span id="dips-counter" class="text-base font-bold text-rose-400">0 / 3 DIPS HELD</span>
          </div>
        </div>

        <!-- Portfolio HUD -->
        <div class="grid grid-cols-3 gap-2 bg-[#130609] p-3 rounded-xl border border-red-950 mb-3 text-xs font-mono">
          <div>
            <span class="text-zinc-400 text-[10px] block">SHARE PRICE</span>
            <div class="flex items-baseline space-x-1.5">
              <span id="price-display" class="text-lg sm:text-xl font-bold text-emerald-400">$100.00</span>
              <span id="pct-display" class="text-[10px] font-bold text-emerald-400">+0.0%</span>
            </div>
          </div>
          <div>
            <span class="text-zinc-400 text-[10px] block">HOLDINGS</span>
            <span id="holdings-display" class="text-lg sm:text-xl font-bold text-white">1.0 Share</span>
          </div>
          <div>
            <span class="text-zinc-400 text-[10px] block">TOTAL PORTFOLIO</span>
            <span id="portfolio-display" class="text-lg sm:text-xl font-bold text-emerald-400">$150.00</span>
          </div>
        </div>

        <!-- 2D Canvas Chart -->
        <div class="relative w-full aspect-[16/9] bg-[#060204] rounded-xl overflow-hidden border border-red-950 shadow-inner mb-4">
          <canvas id="stock-canvas" class="w-full h-full block"></canvas>

          <!-- Dip Notice Banner -->
          <div id="dip-banner" class="hidden absolute top-3 inset-x-4 mx-auto p-2 bg-[#25080c]/90 border border-red-700/80 rounded-lg text-center font-mono z-20 shadow-lg">
            <span class="text-xs font-bold text-rose-300 block">📉 Market Correction in Progress</span>
            <span class="text-[10px] text-rose-200">Natural pullback. Hold your shares through the dip to qualify for dividends.</span>
          </div>

          <!-- Status Bar -->
          <div id="market-status" class="absolute bottom-2 inset-x-3 text-[10px] font-mono text-zinc-400 bg-black/80 px-2 py-1 rounded backdrop-blur truncate flex items-center justify-between border border-red-950/60">
            <span id="ticker-msg">Market status: Normal trading volume. Healthy liquidity.</span>
            <span class="text-emerald-400 font-bold">● LIVE</span>
          </div>
        </div>

        <!-- Buy / Sell Action Controls (Harmonized Colors) -->
        <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-3 font-mono">
          <button id="btn-buy" class="p-3 bg-[#064e3b] hover:bg-[#065f46] text-emerald-200 border border-emerald-800/80 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all transform active:scale-95 flex flex-col items-center cursor-pointer">
            <span>BUY SHARE</span>
            <span class="text-[9px] font-normal text-emerald-300/80">Add to position at market price</span>
          </button>

          <button id="btn-sell" class="p-3 bg-[#7f1d1d] hover:bg-[#991b1b] text-rose-200 border border-rose-900/80 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all transform active:scale-95 flex flex-col items-center cursor-pointer">
            <span>SELL SHARE</span>
            <span class="text-[9px] font-normal text-rose-300/80">Liquidate position (Resets dip streak)</span>
          </button>
        </div>

        <!-- Footer Instructions -->
        <div class="text-center text-[11px] font-mono text-zinc-400 border-t border-red-950 pt-3">
          Pass condition: <strong class="text-rose-300 font-bold">Hold position through 3 natural market dips</strong> without selling to receive an auto-dividend hitting <span class="text-yellow-400 font-bold">$1,000</span>!
        </div>

      </div>
    </div>
  `;

  const canvas = document.getElementById('stock-canvas');
  const ctx = canvas.getContext('2d');
  const priceDisplay = document.getElementById('price-display');
  const pctDisplay = document.getElementById('pct-display');
  const holdingsDisplay = document.getElementById('holdings-display');
  const portfolioDisplay = document.getElementById('portfolio-display');
  const dipsCounter = document.getElementById('dips-counter');
  const dipBanner = document.getElementById('dip-banner');
  const tickerMsg = document.getElementById('ticker-msg');
  const btnBuy = document.getElementById('btn-buy');
  const btnSell = document.getElementById('btn-sell');

  const W = 600;
  const H = 320;
  canvas.width = W;
  canvas.height = H;

  function updateHUD() {
    priceDisplay.textContent = `$${price.toFixed(2)}`;
    const pct = ((price - 100) / 100) * 100;
    pctDisplay.textContent = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
    pctDisplay.className = pct >= 0 ? 'text-[10px] font-bold text-emerald-400' : 'text-[10px] font-bold text-rose-400';

    holdingsDisplay.textContent = `${shares} Share${shares === 1 ? '' : 's'}`;
    const totalVal = cash + (shares * price);
    portfolioDisplay.textContent = `$${totalVal.toFixed(2)}`;
  }

  function addPricePoint(newPrice) {
    prevPrice = price;
    price = Math.max(10, newPrice);
    priceHistory.push(price);
    if (priceHistory.length > MAX_POINTS) {
      priceHistory.shift();
    }
    updateHUD();
  }

  // Normal Buy
  btnBuy.addEventListener('click', () => {
    if (isCompleted) return;
    if (cash >= price) {
      cash -= price;
      shares++;
      tickerMsg.textContent = `Executed BUY: 1 share at $${price.toFixed(2)}.`;
      window.soundEngine.playCraftSuccess();
      updateHUD();
    } else {
      tickerMsg.textContent = `Insufficient cash ($${cash.toFixed(2)}) to purchase at $${price.toFixed(2)}.`;
    }
  });

  // Normal Sell
  btnSell.addEventListener('click', () => {
    if (isCompleted) return;
    if (shares > 0) {
      cash += price;
      shares--;
      tickerMsg.textContent = `Executed SELL: 1 share at $${price.toFixed(2)}.`;
      window.soundEngine.playCraftSuccess();

      // If user sold during or right after a dip, they broke their hold streak!
      if (dipsSurvived > 0) {
        dipsSurvived = 0;
        dipsCounter.textContent = `0 / ${TARGET_DIPS} DIPS HELD`;
        tickerMsg.textContent = `Position liquidated! Dip holding streak reset to 0/3.`;
        tickerMsg.className = 'text-amber-400 font-bold';
      }
      updateHUD();
    } else {
      tickerMsg.textContent = `No shares available to sell.`;
    }
  });

  // Natural Market Dips Cycle
  function scheduleNextNaturalDip() {
    if (isCompleted) return;

    marketTimer = setTimeout(() => {
      triggerNaturalDip();
    }, 3800);
  }

  function triggerNaturalDip() {
    if (isCompleted) return;
    isDipActive = true;

    // A normal healthy market pullback: -14% to -20%
    const dipFactor = 0.82 + Math.random() * 0.05;
    const dipTarget = price * dipFactor;

    dipBanner.classList.remove('hidden');
    tickerMsg.textContent = `Market correction #${dipsSurvived + 1}: Healthy consolidation. Patient investors hold through pullbacks.`;

    // Gradually step down over 1.5s
    let step = 0;
    const dipSteps = 5;
    const stepDiff = (dipTarget - price) / dipSteps;
    const dipInterval = setInterval(() => {
      step++;
      addPricePoint(price + stepDiff);
      if (step >= dipSteps) {
        clearInterval(dipInterval);

        // Hold period: 2 seconds at the low
        setTimeout(() => {
          if (isCompleted) return;
          isDipActive = false;
          dipBanner.classList.add('hidden');

          // If user still holds their shares, count the dip as successfully survived!
          if (shares >= 1) {
            dipsSurvived++;
            dipsCounter.textContent = `${dipsSurvived} / ${TARGET_DIPS} DIPS HELD`;
            window.soundEngine.playSuccessChime();

            tickerMsg.textContent = `✅ Correction #${dipsSurvived} survived without panic selling! Value recovering.`;

            // Natural recovery bounce
            addPricePoint(price * 1.22);

            if (dipsSurvived >= TARGET_DIPS) {
              triggerDividendPayout();
            } else {
              scheduleNextNaturalDip();
            }
          } else {
            tickerMsg.textContent = `You held 0 shares during correction. Streak requires holding a position.`;
            scheduleNextNaturalDip();
          }
        }, 2000);
      }
    }, 200);
  }

  function triggerDividendPayout() {
    isCompleted = true;
    if (marketTimer) clearTimeout(marketTimer);

    // Auto-dividend payout hits $1,000!
    price = 1000.00;
    cash += 500;
    addPricePoint(1000.00);

    window.soundEngine.playChaChing();
    window.soundEngine.playLevelUp();

    dipsCounter.textContent = `3 / 3 COMPLETED!`;
    dipsCounter.className = 'text-base font-bold text-yellow-400';

    tickerMsg.textContent = `🎉 3/3 CORRECTIONS SURVIVED! CORPORATE AUTO-DIVIDEND ISSUED: HIT $1,000.00!`;
    tickerMsg.className = 'text-yellow-300 font-bold animate-pulse';

    setTimeout(() => {
      onComplete();
    }, 1800);
  }

  // Realistic natural price tick (small gentle drift)
  tickInterval = setInterval(() => {
    if (isCompleted || isDipActive) return;
    const drift = (Math.random() * 1.8 - 0.85);
    addPricePoint(price + drift);
  }, 250);

  // Render 2D Canvas Chart
  function renderChart() {
    ctx.clearRect(0, 0, W, H);

    // Subtle horizontal gridlines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let y = 35; y < H - 25; y += 45) {
      ctx.beginPath();
      ctx.moveTo(35, y);
      ctx.lineTo(W - 20, y);
      ctx.stroke();
    }

    const minP = Math.min(...priceHistory) * 0.9;
    const maxP = Math.max(...priceHistory) * 1.1;
    const range = Math.max(1, maxP - minP);

    function getY(p) {
      return H - 35 - ((p - minP) / range) * (H - 70);
    }

    const stepX = (W - 55) / (MAX_POINTS - 1);

    // Draw Smooth Area Line
    ctx.beginPath();
    priceHistory.forEach((p, idx) => {
      const x = 35 + idx * stepX;
      const y = getY(p);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    const isGreen = price >= priceHistory[0];
    const strokeColor = isGreen ? '#10b981' : '#f43f5e';

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Area fill
    ctx.lineTo(35 + (priceHistory.length - 1) * stepX, H - 30);
    ctx.lineTo(35, H - 30);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, isGreen ? 'rgba(16, 185, 129, 0.22)' : 'rgba(244, 63, 94, 0.22)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Current price head circle
    const lastX = 35 + (priceHistory.length - 1) * stepX;
    const lastY = getY(price);
    ctx.fillStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4.5, 0, Math.PI * 2);
    ctx.fill();

    if (!isCompleted) {
      animFrameId = requestAnimationFrame(renderChart);
    }
  }

  animFrameId = requestAnimationFrame(renderChart);
  scheduleNextNaturalDip();

  return function cleanup() {
    isCompleted = true;
    if (marketTimer) clearTimeout(marketTimer);
    if (tickInterval) clearInterval(tickInterval);
    if (animFrameId) cancelAnimationFrame(animFrameId);
  };
};
