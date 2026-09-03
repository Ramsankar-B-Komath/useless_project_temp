// Global State Management & Telemetry Extraction

const gameState = {
  currentStage: 0,
  screamMaxDb: 0,
  breakupFailCount: 0,
  witherDeaths: 0,
  timeStarted: Date.now(),
  rageClicks: 0,
  gdDeaths: 0
};

// Global Rage Click Detection
let lastClickTime = 0;
let quickClickCount = 0;

window.addEventListener('pointerdown', (e) => {
  const now = performance.now();
  const timeDiff = now - lastClickTime;
  lastClickTime = now;

  // If clicked rapidly (< 350ms) or clicked on background / disabled element
  if (timeDiff < 350) {
    quickClickCount++;
    if (quickClickCount >= 2) {
      gameState.rageClicks++;
      updateRageCounterUI();
      triggerRageEffect(e.clientX, e.clientY);
    }
  } else {
    quickClickCount = 0;
  }
}, { passive: true });

function updateRageCounterUI() {
  const el = document.getElementById('global-rage-clicks');
  if (el) {
    el.textContent = gameState.rageClicks;
    el.classList.add('text-red-500', 'scale-125');
    setTimeout(() => el.classList.remove('scale-125'), 150);
  }
}

function triggerRageEffect(x, y) {
  // Spawn subtle rage ripple particle
  const ripple = document.createElement('div');
  ripple.className = 'fixed pointer-events-none text-xs font-mono font-black text-red-500 z-50 select-none animate-ping';
  ripple.style.left = `${x - 10}px`;
  ripple.style.top = `${y - 10}px`;
  ripple.textContent = '⚡RAGE';
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

// Telemetry Harvester
async function harvestTelemetry() {
  // 1. Operating System
  let os = 'Unknown OS';
  const ua = navigator.userAgent;
  if (ua.includes('Win')) os = 'Windows NT (' + (ua.includes('Windows NT 10.0') ? 'Win 10/11' : 'Windows') + ')';
  else if (ua.includes('Mac')) os = 'macOS Darwin';
  else if (ua.includes('Linux')) os = 'Linux Unix-Like';
  else if (ua.includes('Android')) os = 'Android OS';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'Apple iOS';

  // 2. CPU
  const cpuCores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency}` : 'Undisclosed';

  // 3. GPU via WebGL
  let gpuRenderer = 'Standard GPU Rasterizer';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || gpuRenderer;
      } else {
        gpuRenderer = gl.getParameter(gl.RENDERER) || gpuRenderer;
      }
    }
  } catch (err) {
    gpuRenderer = 'Sandboxed WebGL Hardware';
  }

  // 4. Display
  const displaySetup = `${window.screen.width} x ${window.screen.height} @ ${window.devicePixelRatio || 1}x DPR`;

  // 5. Battery
  let batteryStatus = 'AC Line Powered (Desktop)';
  try {
    if (navigator.getBattery) {
      const b = await navigator.getBattery();
      const pct = Math.round(b.level * 100);
      batteryStatus = `${pct}% [${b.charging ? 'Charging' : 'Discharging'}]`;
    }
  } catch (err) {
    batteryStatus = 'Unrestricted Power Line';
  }

  // 6. Network / Locale
  let timeZone = 'UTC';
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch (e) {}

  const language = navigator.language || 'en-US';
  const touchPoints = navigator.maxTouchPoints || 0;

  return {
    os,
    cpuCores,
    gpuRenderer,
    displaySetup,
    batteryStatus,
    timeZone,
    language,
    touchPoints,
    screamMaxDb: Math.round(gameState.screamMaxDb),
    breakupFailCount: gameState.breakupFailCount,
    witherDeaths: gameState.witherDeaths,
    rageClicks: gameState.rageClicks,
    gdDeaths: gameState.gdDeaths
  };
}

window.gameState = gameState;
window.harvestTelemetry = harvestTelemetry;
