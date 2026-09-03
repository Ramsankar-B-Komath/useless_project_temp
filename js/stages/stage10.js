// Stage 10: Geometry Dash (Clutterfunk Sprint)
// 60 FPS Canvas 2D Side-Scrolling Platformer
// Uses authentic custom uploaded GD assets (cube, spikes, double spikes, portal, background).
// Smooth transitions, fair jump distances, and polished ship flight corridor.

window.initStage10 = function(container, onComplete) {
  let isCompleted = false;

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center p-2 sm:p-4 max-w-2xl mx-auto w-full select-none">
      
      <!-- GD Header -->
      <div class="w-full bg-[#0c0406] border-2 border-red-950/80 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden mb-3">
        <div class="flex items-center justify-between border-b border-red-950 pb-2 mb-2 font-mono">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span class="text-xs text-rose-400 font-bold uppercase tracking-wider">STAGE 10 / 10: CLUTTERFUNK SPRINT</span>
          </div>
          <div class="text-xs text-rose-400 font-bold">
            CRASHES: <span id="gd-deaths-badge">${window.gameState.gdDeaths || 0}</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <h2 class="text-lg sm:text-xl font-black text-white tracking-wide font-mono flex items-center space-x-2">
            <span class="text-yellow-400">⚡ 10-Second Reflex Gauntlet</span>
          </h2>
          <span class="text-[10px] text-zinc-400 font-mono">Target: 100% (10.0s)</span>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-black/80 h-3.5 rounded-full overflow-hidden border border-red-950 mt-3 relative">
          <div id="gd-progress-bar" class="h-full bg-gradient-to-r from-red-600 via-rose-500 to-yellow-400 w-0 transition-all duration-75"></div>
          <span id="gd-progress-text" class="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold text-white drop-shadow">0% (0.0s / 10.0s)</span>
        </div>
      </div>

      <!-- Canvas Game Viewport -->
      <div class="relative w-full aspect-[16/9] bg-[#030102] rounded-2xl overflow-hidden border-2 border-red-950/80 shadow-2xl">
        <canvas id="gd-canvas" class="w-full h-full block cursor-pointer"></canvas>

        <!-- Current Mode Indicator Tag -->
        <div id="gd-mode-badge" class="absolute top-2 left-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-black/80 text-rose-300 border border-red-900/60 pointer-events-none">
          MODE: CUBE (1.2x SPEED)
        </div>

        <!-- Tap to Jump / Start Overlay Hint -->
        <div id="gd-start-hint" class="absolute inset-0 flex flex-col items-center justify-center bg-black/70 pointer-events-none transition-opacity">
          <div class="text-2xl sm:text-3xl mb-1 animate-bounce">👆</div>
          <span class="text-xs sm:text-sm font-mono font-bold text-rose-200 uppercase tracking-wider bg-[#25080c]/95 px-4 py-1.5 rounded-xl border border-red-600/70 shadow-lg shadow-red-950/80">
            TAP / SPACEBAR TO JUMP
          </span>
          <span class="text-[10px] text-zinc-400 font-mono mt-1">10-second run starts on first tap</span>
        </div>
      </div>

      <!-- Controls Hint -->
      <div class="mt-3 text-center text-[11px] font-mono text-zinc-400">
        Controls: <span class="text-rose-400 font-bold">[Spacebar]</span>, <span class="text-rose-400 font-bold">[Up Arrow]</span>, or <span class="text-rose-400 font-bold">Screen Click / Tap</span>.
      </div>

    </div>
  `;

  const canvas = document.getElementById('gd-canvas');
  const ctx = canvas.getContext('2d');
  const progressBar = document.getElementById('gd-progress-bar');
  const progressText = document.getElementById('gd-progress-text');
  const modeBadge = document.getElementById('gd-mode-badge');
  const deathsBadge = document.getElementById('gd-deaths-badge');
  const startHint = document.getElementById('gd-start-hint');

  const W = 640;
  const H = 360;
  canvas.width = W;
  canvas.height = H;

  const FLOOR_Y = H - 50;
  const CEIL_Y = 50;

  let gdCubeImg = null;
  window.getSpriteImage('gdCube', (img) => { gdCubeImg = img; });

  let gdShipImg = null;
  window.getSpriteImage('gdShip', (img) => { gdShipImg = img; });

  let gdSingleSpikeImg = null;
  window.getSpriteImage('gdSpike', (img) => { gdSingleSpikeImg = img; });

  let gdDoubleSpikeImg = null;
  window.getSpriteImage('gdDoubleSpike', (img) => { gdDoubleSpikeImg = img; });

  let gdPortalImg = null;
  window.getSpriteImage('gdPortal', (img) => { gdPortalImg = img; });

  let gdBgImg = null;
  window.getSpriteImage('gdBg', (img) => { gdBgImg = img; });

  // Sprint Total Time: 10.0 seconds
  const TOTAL_DURATION = 10.0;
  let gameTime = 0.0;
  let isDead = false;
  let hasStarted = false;

  // Player state
  const player = {
    x: 100,
    y: FLOOR_Y - 32,
    w: 32,
    h: 32,
    vy: 0,
    rotation: 0,
    mode: 'cube',
    gravityDir: 1,
    onGround: true,
    isMini: false
  };

  let deathParticles = [];
  let isHoldingJump = false;

  function setJumpInput(holding) {
    if (isCompleted) return;
    if (!hasStarted) {
      hasStarted = true;
      if (startHint) startHint.classList.add('hidden');
    }
    isHoldingJump = holding;
    if (holding && !isDead) {
      if (player.mode === 'cube' || player.mode === 'gravity' || player.mode === 'mini') {
        if (player.onGround) {
          const jumpPower = player.isMini ? 11.2 : 12.6;
          player.vy = -jumpPower * player.gravityDir;
          player.onGround = false;
          window.soundEngine.playGdJump();
        }
      }
    }
  }

  // Pointer & keyboard input handlers
  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    setJumpInput(true);
  });
  window.addEventListener('pointerup', () => setJumpInput(false));

  const keyHandlerDown = (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      setJumpInput(true);
    }
  };
  const keyHandlerUp = (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      setJumpInput(false);
    }
  };
  window.addEventListener('keydown', keyHandlerDown);
  window.addEventListener('keyup', keyHandlerUp);

  // Level Obstacles Timeline
  const OBSTACLES = [
    // 0s-3s: Cube Mode over multi-spikes
    { time: 1.0, type: 'spike', count: 1 },
    { time: 1.8, type: 'spike', count: 2 },
    { time: 2.5, type: 'spike', count: 1 },

    // 3.0s: Gravity Portal (Blue)
    { time: 3.0, type: 'portalGravity' },

    // 3s-6s: Upside-Down Jumping over ceiling spikes
    { time: 3.9, type: 'ceilSpike', count: 1 },
    { time: 4.8, type: 'ceilSpike', count: 2 },
    { time: 5.4, type: 'ceilSpike', count: 1 },

    // 6.0s: Mini-Cube Speedup Portal (Green & Orange)
    { time: 6.0, type: 'portalMini' },

    // 6s-8s: Mini speed spikes (Fair single spikes with ample reaction time)
    { time: 6.8, type: 'spike', count: 1, mini: true },
    { time: 7.4, type: 'spike', count: 1, mini: true },

    // 8.0s: Ship Form Portal (Pink)
    { time: 8.0, type: 'portalShip' },

    // 8s-10s: Ship tunnel navigation (Weaving between floor & ceiling spikes)
    { time: 8.6, type: 'spike', count: 1 },
    { time: 9.0, type: 'ceilSpike', count: 1 },
    { time: 9.5, type: 'spike', count: 1 }
  ];

  function resetLevel() {
    isDead = false;
    gameTime = 0.0;
    deathParticles = [];
    player.x = 100;
    player.y = FLOOR_Y - 32;
    player.w = 32;
    player.h = 32;
    player.vy = 0;
    player.rotation = 0;
    player.mode = 'cube';
    player.gravityDir = 1;
    player.onGround = true;
    player.isMini = false;

    if (modeBadge) {
      modeBadge.textContent = 'MODE: CUBE (1.2x SPEED)';
      modeBadge.className = 'absolute top-2 left-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-black/70 text-cyan-300 border border-cyan-500/40 pointer-events-none';
    }
  }

  function handleCrash() {
    if (isDead || isCompleted) return;
    isDead = true;
    window.gameState.gdDeaths = (window.gameState.gdDeaths || 0) + 1;
    if (deathsBadge) deathsBadge.textContent = window.gameState.gdDeaths;

    window.soundEngine.playGdCrash();

    // Spawn 24 pixel shatter particles
    for (let i = 0; i < 24; i++) {
      deathParticles.push({
        x: player.x + player.w / 2,
        y: player.y + player.h / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.5) * 14,
        size: 4 + Math.random() * 5,
        color: ['#22c55e', '#38bdf8', '#facc15', '#ec4899', '#ffffff'][Math.floor(Math.random() * 5)],
        life: 1.0
      });
    }

    setTimeout(() => {
      resetLevel();
    }, 650);
  }

  // Generous hitbox with 5px padding on edges
  function checkSpikeCollision(spikeX, spikeY, spikeW, spikeH, isCeil = false) {
    const px = player.x + 6;
    const py = player.y + 4;
    const pw = player.w - 12;
    const ph = player.h - 8;

    const hitBox = isCeil
      ? (px + pw > spikeX + 5 && px < spikeX + spikeW - 5 && py < spikeY + spikeH - 4)
      : (px + pw > spikeX + 5 && px < spikeX + spikeW - 5 && py + ph > spikeY + 4);

    return hitBox;
  }

  let lastTimestamp = performance.now();

  function updateGame(now) {
    const dt = Math.min(0.05, (now - lastTimestamp) / 1000);
    lastTimestamp = now;

    if (!isCompleted && !isDead && hasStarted) {
      gameTime += dt;
      const progress = Math.min(100, (gameTime / TOTAL_DURATION) * 100);
      progressBar.style.width = `${progress}%`;
      progressText.textContent = `${progress.toFixed(0)}% (${gameTime.toFixed(1)}s / ${TOTAL_DURATION}s)`;

      let speedFactor = 1.2;
      if (gameTime >= 6.0 && gameTime < 8.0) speedFactor = 1.5;

      // Mode Transitions from Timeline
      if (gameTime >= 3.0 && gameTime < 6.0) {
        if (player.mode !== 'gravity') {
          player.mode = 'gravity';
          player.gravityDir = -1; // Upside down!
          window.soundEngine.playGdPortal();
          modeBadge.textContent = 'MODE: GRAVITY FLIP (CEILING)';
          modeBadge.className = 'absolute top-2 left-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-950/80 text-blue-300 border border-blue-400 pointer-events-none animate-pulse';
        }
      } else if (gameTime >= 6.0 && gameTime < 8.0) {
        if (player.mode !== 'mini') {
          player.mode = 'mini';
          player.gravityDir = 1; // Back to floor
          player.isMini = true;
          player.w = 20;
          player.h = 20;
          window.soundEngine.playGdPortal();
          modeBadge.textContent = 'MODE: MINI-CUBE (1.5x SPEED)';
          modeBadge.className = 'absolute top-2 left-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-orange-950/80 text-orange-300 border border-orange-400 pointer-events-none animate-pulse';
        }
      } else if (gameTime >= 8.0) {
        if (player.mode !== 'ship') {
          player.mode = 'ship';
          player.isMini = false;
          player.w = 34;
          player.h = 22;
          player.gravityDir = 1;
          // Clean elevation into mid-air flight corridor!
          player.y = (FLOOR_Y + CEIL_Y) / 2 - 12;
          player.vy = 0;
          window.soundEngine.playGdPortal();
          modeBadge.textContent = 'MODE: SHIP NAVIGATION (HOLD TO THRUST)';
          modeBadge.className = 'absolute top-2 left-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-400 pointer-events-none animate-pulse';
        }
      }

      // Physics based on mode
      if (player.mode === 'ship') {
        if (isHoldingJump) {
          player.vy -= 0.52;
        } else {
          player.vy += 0.44;
        }
        player.vy = Math.max(-5.0, Math.min(5.0, player.vy));
        player.y += player.vy;
        player.rotation = player.vy * 0.08;

        // Keep ship bounded inside arena safely (no instant floor suicide!)
        if (player.y < CEIL_Y) {
          player.y = CEIL_Y;
          player.vy = 0;
        }
        if (player.y + player.h > FLOOR_Y) {
          player.y = FLOOR_Y - player.h;
          player.vy = 0;
        }
      } else {
        const gravityAcc = (player.isMini ? 0.60 : 0.52) * player.gravityDir;
        player.vy += gravityAcc;
        player.y += player.vy;

        if (player.gravityDir === 1) {
          if (player.y + player.h >= FLOOR_Y) {
            player.y = FLOOR_Y - player.h;
            player.vy = 0;
            player.onGround = true;
            player.rotation = Math.round(player.rotation / (Math.PI / 2)) * (Math.PI / 2);
          } else {
            player.onGround = false;
            player.rotation += 0.12 * speedFactor;
          }
        } else {
          if (player.y <= CEIL_Y) {
            player.y = CEIL_Y;
            player.vy = 0;
            player.onGround = true;
            player.rotation = Math.round(player.rotation / (Math.PI / 2)) * (Math.PI / 2);
          } else {
            player.onGround = false;
            player.rotation -= 0.12 * speedFactor;
          }
        }
      }

      // Collision checks with active obstacles
      const basePixelsPerSecond = 240;
      OBSTACLES.forEach(obs => {
        const timeDiff = obs.time - gameTime;
        const obsX = player.x + timeDiff * basePixelsPerSecond * speedFactor;

        if (obsX > -60 && obsX < W + 60) {
          if (obs.type === 'spike') {
            const count = obs.count || 1;
            const w = obs.mini ? 16 : 24;
            const h = obs.mini ? 18 : 26;
            for (let c = 0; c < count; c++) {
              const spikeLeft = obsX + c * w;
              if (checkSpikeCollision(spikeLeft, FLOOR_Y - h, w, h, false)) {
                handleCrash();
              }
            }
          } else if (obs.type === 'ceilSpike') {
            const count = obs.count || 1;
            const w = 24;
            const h = 26;
            for (let c = 0; c < count; c++) {
              const spikeLeft = obsX + c * w;
              if (checkSpikeCollision(spikeLeft, CEIL_Y, w, h, true)) {
                handleCrash();
              }
            }
          }
        }
      });

      // Win Condition: 10.0 seconds survived!
      if (gameTime >= TOTAL_DURATION) {
        isCompleted = true;
        progressBar.style.width = '100%';
        progressText.textContent = '100% COMPLETED! GAUNTLET CLEARED!';
        window.soundEngine.playLevelUp();
        window.soundEngine.playSuccessChime();

        setTimeout(() => {
          onComplete();
        }, 1200);
      }
    }

    // Update death particles
    if (deathParticles.length > 0) {
      deathParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
      });
      deathParticles = deathParticles.filter(p => p.life > 0);
    }
  }

  // Draw Scene
  function render(now) {
    updateGame(now);

    ctx.clearRect(0, 0, W, H);

    // 1. Geometry Dash Wallpaper Background
    if (gdBgImg && gdBgImg.complete && gdBgImg.naturalWidth > 0) {
      const scrollOffset = (gameTime * 70) % W;
      ctx.drawImage(gdBgImg, -scrollOffset, 0, W, H);
      ctx.drawImage(gdBgImg, W - scrollOffset, 0, W, H);
    } else {
      ctx.fillStyle = '#080d22';
      ctx.fillRect(0, 0, W, H);
    }

    // Floor & Ceiling Plates
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, FLOOR_Y, W, H - FLOOR_Y);
    ctx.fillRect(0, 0, W, CEIL_Y);

    // Glowing boundary lines
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, FLOOR_Y);
    ctx.lineTo(W, FLOOR_Y);
    ctx.moveTo(0, CEIL_Y);
    ctx.lineTo(W, CEIL_Y);
    ctx.stroke();

    // Floor scrolling grid accents
    const scrollTicks = (gameTime * 280) % 30;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.5;
    for (let x = -scrollTicks; x < W; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, FLOOR_Y);
      ctx.lineTo(x + 12, H);
      ctx.moveTo(x, CEIL_Y);
      ctx.lineTo(x + 12, 0);
      ctx.stroke();
    }

    // 2. Draw Obstacles from Timeline
    const speedFactor = (gameTime >= 6.0 && gameTime < 8.0) ? 1.5 : 1.2;
    const basePixelsPerSecond = 240;

    OBSTACLES.forEach(obs => {
      const timeDiff = obs.time - gameTime;
      const obsX = player.x + timeDiff * basePixelsPerSecond * speedFactor;

      if (obsX > -60 && obsX < W + 60) {
        if (obs.type === 'spike') {
          const count = obs.count || 1;
          const w = obs.mini ? 16 : 24;
          const h = obs.mini ? 18 : 26;

          if (count === 2 && gdDoubleSpikeImg && gdDoubleSpikeImg.complete && gdDoubleSpikeImg.naturalWidth > 0) {
            ctx.drawImage(gdDoubleSpikeImg, obsX, FLOOR_Y - h, w * 2, h);
          } else if (count === 1 && gdSingleSpikeImg && gdSingleSpikeImg.complete && gdSingleSpikeImg.naturalWidth > 0) {
            ctx.drawImage(gdSingleSpikeImg, obsX, FLOOR_Y - h, w, h);
          } else {
            // Vector fallback
            for (let c = 0; c < count; c++) {
              const sx = obsX + c * w;
              const sy = FLOOR_Y;
              ctx.fillStyle = '#0f172a';
              ctx.strokeStyle = '#38bdf8';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(sx, sy);
              ctx.lineTo(sx + w / 2, sy - h);
              ctx.lineTo(sx + w, sy);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            }
          }
        } else if (obs.type === 'ceilSpike') {
          const count = obs.count || 1;
          const w = 24;
          const h = 26;

          ctx.save();
          ctx.translate(obsX + (w * count) / 2, CEIL_Y + h / 2);
          ctx.scale(1, -1);

          if (count === 2 && gdDoubleSpikeImg && gdDoubleSpikeImg.complete && gdDoubleSpikeImg.naturalWidth > 0) {
            ctx.drawImage(gdDoubleSpikeImg, -(w * count) / 2, -h / 2, w * 2, h);
          } else if (count === 1 && gdSingleSpikeImg && gdSingleSpikeImg.complete && gdSingleSpikeImg.naturalWidth > 0) {
            ctx.drawImage(gdSingleSpikeImg, -(w * count) / 2, -h / 2, w, h);
          } else {
            for (let c = 0; c < count; c++) {
              const sx = -(w * count) / 2 + c * w;
              const sy = -h / 2;
              ctx.fillStyle = '#0f172a';
              ctx.strokeStyle = '#38bdf8';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(sx, sy);
              ctx.lineTo(sx + w / 2, sy + h);
              ctx.lineTo(sx + w, sy);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            }
          }
          ctx.restore();
        } else if (obs.type.startsWith('portal')) {
          // Authentic GD Portal Sprite
          if (gdPortalImg && gdPortalImg.complete && gdPortalImg.naturalWidth > 0) {
            ctx.drawImage(gdPortalImg, obsX, (FLOOR_Y + CEIL_Y) / 2 - 45, 38, 90);
          } else {
            const color = obs.type === 'portalGravity' ? '#38bdf8' : obs.type === 'portalMini' ? '#f97316' : '#ec4899';
            ctx.strokeStyle = color;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.ellipse(obsX + 15, H / 2, 12, 55, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
    });

    // 3. Draw Player
    if (!isDead) {
      ctx.save();
      ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
      ctx.rotate(player.rotation);

      if (player.mode === 'ship') {
        const sw = 42;
        const sh = 28;
        if (gdShipImg && gdShipImg.complete && gdShipImg.naturalWidth > 0) {
          ctx.drawImage(gdShipImg, -sw / 2, -sh / 2, sw, sh);
        } else {
          ctx.fillStyle = '#1e3a8a';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(16, 0);
          ctx.lineTo(-14, -10);
          ctx.lineTo(-8, 0);
          ctx.lineTo(-14, 10);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        // Thruster flame when holding jump
        if (isHoldingJump) {
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.moveTo(-sw / 2 + 6, -3);
          ctx.lineTo(-sw / 2 - 14 - Math.random() * 8, 0);
          ctx.lineTo(-sw / 2 + 6, 3);
          ctx.fill();
        }
      } else {
        // Draw Geometry Dash Cube (Custom uploaded gd_cube.png sprite!)
        const size = player.w;
        if (gdCubeImg && gdCubeImg.complete && gdCubeImg.naturalWidth > 0) {
          ctx.drawImage(gdCubeImg, -size / 2, -size / 2, size, size);
        } else {
          const color = player.isMini ? '#f97316' : (player.gravityDir === -1 ? '#38bdf8' : '#22c55e');
          ctx.fillStyle = color;
          ctx.fillRect(-size / 2, -size / 2, size, size);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.strokeRect(-size / 2, -size / 2, size, size);
        }
      }
      ctx.restore();
    }

    // 4. Draw Death Particles
    if (deathParticles.length > 0) {
      deathParticles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      });
      ctx.globalAlpha = 1.0;
    }

    if (!isCompleted) {
      animFrameId = requestAnimationFrame(render);
    }
  }

  let animFrameId = requestAnimationFrame(render);

  return function cleanup() {
    isCompleted = true;
    if (animFrameId) cancelAnimationFrame(animFrameId);
    window.removeEventListener('keydown', keyHandlerDown);
    window.removeEventListener('keyup', keyHandlerUp);
  };
};
