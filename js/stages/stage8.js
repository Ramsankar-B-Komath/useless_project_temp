// Stage 8: Basketball Free Throws (No Wind Factor)
// 2D Physics Canvas: drag-and-release trajectory line, moving rim sliding horizontally.
// Mechanics: Sink 3 consecutive free throws. Missing resets score to 0/3 with rim-clank audio effect.

window.initStage8 = function(container, onComplete) {
  let score = 0;
  const TARGET_SCORE = 3;
  let isCompleted = false;

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center p-2 sm:p-4 max-w-2xl mx-auto w-full select-none">
      
      <!-- Card Container -->
      <div class="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
        
        <!-- Header -->
        <div class="flex justify-between items-center mb-3">
          <div>
            <div class="inline-flex items-center space-x-2 px-2.5 py-0.5 bg-orange-950 border border-orange-600/50 rounded-full text-orange-400 text-[11px] font-mono mb-1">
              <span>STAGE 8 / 8: FINAL KINETIC MOTOR SKILL TEST</span>
            </div>
            <h2 class="text-lg sm:text-xl font-black text-white">Moving Rim Free Throws</h2>
          </div>

          <!-- Consecutive Score Counter -->
          <div class="text-right">
            <span class="text-[10px] font-mono text-slate-400 block">CONSECUTIVE STREAK</span>
            <div class="flex items-center space-x-1.5 justify-end">
              <span id="streak-counter" class="text-2xl font-black font-mono text-orange-400">0 / 3</span>
            </div>
          </div>
        </div>

        <p class="text-xs text-slate-300 mb-3 font-mono">
          Sink <strong class="text-orange-400 font-bold">3 consecutive shots</strong> into the moving rim. Missing resets your streak to 0. (No wind factor active).
        </p>

        <!-- Canvas Container -->
        <div class="relative w-full aspect-[16/10] bg-gradient-to-b from-slate-950 via-slate-900 to-amber-950/40 rounded-xl overflow-hidden border-2 border-slate-700 shadow-inner">
          <canvas id="basketball-canvas" class="w-full h-full block cursor-crosshair"></canvas>

          <!-- Instructions Overlay -->
          <div id="shot-result-banner" class="hidden absolute top-4 inset-x-0 mx-auto w-fit px-4 py-1.5 rounded-full text-xs font-mono font-bold text-center z-20 shadow-lg"></div>
        </div>

        <!-- Touch / Drag Hint -->
        <div class="mt-3 flex justify-between items-center text-[11px] font-mono text-slate-400">
          <span>🎯 Drag from ball to aim trajectory, release to shoot.</span>
          <button id="btn-reset-ball" class="text-slate-500 hover:text-slate-300 underline">Reset Ball</button>
        </div>

      </div>
    </div>
  `;

  const canvas = document.getElementById('basketball-canvas');
  const ctx = canvas.getContext('2d');
  const streakText = document.getElementById('streak-counter');
  const resultBanner = document.getElementById('shot-result-banner');
  const btnResetBall = document.getElementById('btn-reset-ball');

  // Set internal resolution
  const W = 640;
  const H = 400;
  canvas.width = W;
  canvas.height = H;

  // Basketball Sprite Image
  let ballImg = null;
  window.getSpriteImage('basketball', (img) => {
    ballImg = img;
  });

  // Ball properties
  const BALL_RADIUS = 18;
  const START_X = 110;
  const START_Y = 300;

  const ball = {
    x: START_X,
    y: START_Y,
    vx: 0,
    vy: 0,
    isFlying: false,
    hasScored: false,
    passedRim: false,
    rotation: 0
  };

  // Drag state
  let isDragging = false;
  let dragCurrentX = START_X;
  let dragCurrentY = START_Y;

  // Moving Rim
  const RIM_Y = 140;
  const RIM_WIDTH = 56;
  const RIM_CENTER_X = 480;
  const RIM_AMPLITUDE = 60;
  let rimSpeed = 0.0022;
  let currentRimX = RIM_CENTER_X;

  let animFrameId = null;

  function showBanner(text, type = 'error') {
    resultBanner.textContent = text;
    resultBanner.className = `absolute top-4 inset-x-0 mx-auto w-fit px-4 py-1.5 rounded-full text-xs font-mono font-bold text-center z-20 shadow-lg ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-600 text-white animate-bounce'
    }`;
    resultBanner.classList.remove('hidden');
    setTimeout(() => {
      resultBanner.classList.add('hidden');
    }, 1800);
  }

  function resetBall() {
    ball.x = START_X;
    ball.y = START_Y;
    ball.vx = 0;
    ball.vy = 0;
    ball.isFlying = false;
    ball.hasScored = false;
    ball.passedRim = false;
    ball.rotation = 0;
  }

  btnResetBall.addEventListener('click', () => {
    if (!isCompleted) resetBall();
  });

  // Coordinate mapper from event to internal canvas resolution
  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  // Pointer interactions
  canvas.addEventListener('pointerdown', (e) => {
    if (isCompleted || ball.isFlying) return;
    const coords = getCanvasCoords(e);
    // Allow dragging anywhere near the ball
    const dist = Math.hypot(coords.x - ball.x, coords.y - ball.y);
    if (dist < 70) {
      isDragging = true;
      dragCurrentX = coords.x;
      dragCurrentY = coords.y;
    }
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const coords = getCanvasCoords(e);
    dragCurrentX = coords.x;
    dragCurrentY = coords.y;
  });

  window.addEventListener('pointerup', () => {
    if (!isDragging) return;
    isDragging = false;

    // Slingshot launch calculation
    const dx = START_X - dragCurrentX;
    const dy = START_Y - dragCurrentY;
    const power = 0.16;

    if (Math.hypot(dx, dy) > 15) {
      ball.vx = dx * power;
      ball.vy = dy * power;
      ball.isFlying = true;
      ball.hasScored = false;
      ball.passedRim = false;
    }
  });

  function updatePhysics(timestamp) {
    // 1. Move the rim continuously along fixed Y-axis (No wind factor)
    currentRimX = RIM_CENTER_X + Math.sin(timestamp * rimSpeed) * RIM_AMPLITUDE;

    const backboardX = currentRimX + RIM_WIDTH + 8;
    const backboardTop = RIM_Y - 50;
    const backboardHeight = 85;

    // 2. Ball physics
    if (ball.isFlying) {
      ball.vy += 0.38; // gravity
      ball.vx *= 0.995; // air resistance
      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.rotation += ball.vx * 0.04;

      // Floor bounce & miss check
      if (ball.y + BALL_RADIUS >= H - 20) {
        ball.y = H - 20 - BALL_RADIUS;
        ball.vy = -ball.vy * 0.5;
        ball.vx *= 0.7;

        window.soundEngine.playBallBounce();

        // If didn't score on this shot -> Reset streak to 0!
        if (!ball.hasScored && !ball.passedRim) {
          ball.passedRim = true;
          window.soundEngine.playRimClank();
          window.soundEngine.playCustomFail();
          score = 0;
          streakText.textContent = `${score} / ${TARGET_SCORE}`;
          showBanner('❌ MISSED SHOT! Streak reset to 0/3', 'error');

          setTimeout(() => {
            if (!isCompleted) resetBall();
          }, 900);
        } else {
          setTimeout(() => {
            if (!isCompleted) resetBall();
          }, 700);
        }
      }

      // Walls / ceiling
      if (ball.x - BALL_RADIUS < 0) {
        ball.x = BALL_RADIUS;
        ball.vx = -ball.vx * 0.6;
      }
      if (ball.x + BALL_RADIUS > W) {
        ball.x = W - BALL_RADIUS;
        ball.vx = -ball.vx * 0.6;
      }

      // Backboard collision
      if (
        ball.x + BALL_RADIUS >= backboardX &&
        ball.x - BALL_RADIUS <= backboardX + 10 &&
        ball.y >= backboardTop &&
        ball.y <= backboardTop + backboardHeight
      ) {
        ball.vx = -Math.abs(ball.vx) * 0.7;
        ball.x = backboardX - BALL_RADIUS;
        window.soundEngine.playRimClank();
      }

      // Rim Pegs (Front Peg & Back Peg)
      const frontPeg = { x: currentRimX, y: RIM_Y, r: 5 };
      const backPeg = { x: currentRimX + RIM_WIDTH, y: RIM_Y, r: 5 };

      [frontPeg, backPeg].forEach(peg => {
        const dx = ball.x - peg.x;
        const dy = ball.y - peg.y;
        const dist = Math.hypot(dx, dy);
        if (dist < BALL_RADIUS + peg.r) {
          // Bounce off peg
          const nx = dx / dist;
          const ny = dy / dist;
          const dot = ball.vx * nx + ball.vy * ny;
          ball.vx = (ball.vx - 2 * dot * nx) * 0.65;
          ball.vy = (ball.vy - 2 * dot * ny) * 0.65;
          ball.x = peg.x + nx * (BALL_RADIUS + peg.r);
          ball.y = peg.y + ny * (BALL_RADIUS + peg.r);
          window.soundEngine.playRimClank();
        }
      });

      // Scoring Detection (Passing downward between rim bounds)
      if (
        !ball.hasScored &&
        ball.vy > 0 &&
        ball.x > currentRimX + 6 &&
        ball.x < currentRimX + RIM_WIDTH - 6 &&
        ball.y >= RIM_Y - 4 &&
        ball.y <= RIM_Y + 16
      ) {
        ball.hasScored = true;
        ball.passedRim = true;
        ball.vy *= 0.6; // Net friction

        window.soundEngine.playSwish();
        score++;
        streakText.textContent = `${score} / ${TARGET_SCORE}`;

        if (score >= TARGET_SCORE) {
          isCompleted = true;
          showBanner('🏀 3 IN A ROW! GAUNTLET COMPLETED!', 'success');
          window.soundEngine.playLevelUp();

          setTimeout(() => {
            onComplete();
          }, 1500);
        } else {
          showBanner(`🔥 SWISH! (${score}/${TARGET_SCORE})`, 'success');
        }
      }
    }
  }

  function render(timestamp) {
    updatePhysics(timestamp);

    ctx.clearRect(0, 0, W, H);

    // 1. Draw Court Floor
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, H - 20, W, 20);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(0, H - 20, W, 4);

    // Free Throw Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(START_X + 20, H - 20);
    ctx.lineTo(START_X + 20, H);
    ctx.stroke();

    // 2. Draw Moving Basket Rim & Backboard
    const backboardX = currentRimX + RIM_WIDTH + 8;
    const backboardTop = RIM_Y - 50;

    // Pole & Support Arm
    ctx.fillStyle = '#475569';
    ctx.fillRect(backboardX + 8, backboardTop + 30, 40, 8);
    ctx.fillRect(backboardX + 40, backboardTop + 30, 10, H - (backboardTop + 30) - 20);

    // Backboard Glass & Red Target Square
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(backboardX, backboardTop, 8, 85);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(backboardX - 1, RIM_Y - 24, 2, 28);

    // Net Strings
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const netY = RIM_Y;
    const netH = 34;
    for (let x = currentRimX + 4; x <= currentRimX + RIM_WIDTH - 4; x += 10) {
      ctx.moveTo(x, netY);
      ctx.lineTo(x + (currentRimX + RIM_WIDTH / 2 - x) * 0.35, netY + netH);
    }
    ctx.stroke();

    // The Orange Rim Cylinder
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(currentRimX, RIM_Y);
    ctx.lineTo(currentRimX + RIM_WIDTH, RIM_Y);
    ctx.stroke();

    // Rim Pegs
    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    ctx.arc(currentRimX, RIM_Y, 4, 0, Math.PI * 2);
    ctx.arc(currentRimX + RIM_WIDTH, RIM_Y, 4, 0, Math.PI * 2);
    ctx.fill();

    // 3. Aim Trajectory Line when dragging
    if (isDragging) {
      const dx = START_X - dragCurrentX;
      const dy = START_Y - dragCurrentY;
      const power = 0.16;
      let simX = START_X;
      let simY = START_Y;
      let simVx = dx * power;
      let simVy = dy * power;

      ctx.beginPath();
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.75)';
      ctx.lineWidth = 2.5;
      ctx.moveTo(simX, simY);

      for (let step = 0; step < 26; step++) {
        simVy += 0.38;
        simX += simVx;
        simY += simVy;
        ctx.lineTo(simX, simY);
        if (simY > H - 20) break;
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Slingshot pull line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(START_X, START_Y);
      ctx.lineTo(dragCurrentX, dragCurrentY);
      ctx.stroke();
    }

    // 4. Draw Basketball
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate(ball.rotation);

    if (ballImg && ballImg.complete && ballImg.naturalWidth > 0) {
      ctx.drawImage(ballImg, -BALL_RADIUS, -BALL_RADIUS, BALL_RADIUS * 2, BALL_RADIUS * 2);
    } else {
      // Fallback vector ball
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(0, 0, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#7c2d12';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();

    if (!isCompleted) {
      animFrameId = requestAnimationFrame(render);
    }
  }

  animFrameId = requestAnimationFrame(render);

  return function cleanup() {
    isCompleted = true;
    if (animFrameId) cancelAnimationFrame(animFrameId);
  };
};
