// Stage 1: Screaming Verification
// Requires holding a microphone scream >= 80 dB for 3.0 continuous seconds

window.initStage1 = function(container, onComplete) {
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full">
      <div class="w-full bg-[#0d0507] border-2 border-red-950/80 rounded-2xl p-6 shadow-2xl text-center">
        
        <!-- Header -->
        <div class="inline-flex items-center space-x-2 px-3 py-1 bg-[#1a0609] border border-red-900/60 rounded-full text-red-300 text-xs font-mono mb-4">
          <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span>STAGE 1 / 10: ACOUSTIC INTENSITY EXAM</span>
        </div>

        <h2 class="text-xl sm:text-2xl font-black text-white font-mono tracking-wide">
          Screaming Decibel Verification
        </h2>
        <p class="text-xs text-zinc-400 mt-2 max-w-md mx-auto">
          Hold a continuous scream above <strong class="text-rose-400">80 dB for 3 continuous seconds</strong>. If your voice wavers or drops below 80 dB, progress immediately drains to 0%.
        </p>

        <!-- Mic Permission Start Box -->
        <div id="mic-prompt-box" class="my-4 p-4 bg-[#140608] rounded-xl border border-red-950">
          <button id="btn-start-mic" class="px-5 py-3 bg-gradient-to-r from-red-800 to-rose-700 hover:from-red-700 hover:to-rose-600 active:scale-95 text-white font-mono font-bold text-xs sm:text-sm rounded-xl border border-red-600/60 shadow-lg shadow-red-950/50 transition-all flex items-center justify-center mx-auto space-x-2 cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
            </svg>
            <span>Activate Microphone & Begin Screaming</span>
          </button>
        </div>

        <!-- Live Decibel Visualizer -->
        <div id="meter-container" class="hidden my-4 space-y-4">
          <!-- dB Display -->
          <div class="flex items-baseline justify-center space-x-2">
            <span id="live-db-text" class="text-4xl sm:text-5xl font-mono font-extrabold text-white">0</span>
            <span class="text-lg font-mono text-slate-400">dB</span>
            <span class="text-xs font-mono text-yellow-400 ml-2">(Target: ≥ 80 dB)</span>
          </div>

          <!-- Volume Gauge Meter -->
          <div class="w-full bg-slate-800 h-5 rounded-full overflow-hidden p-0.5 border border-slate-700 relative">
            <div id="db-bar" class="h-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 rounded-full transition-all duration-75 w-0"></div>
            <!-- 80dB Threshold marker line (80 / 110 = ~73%) -->
            <div class="absolute top-0 bottom-0 left-[72.7%] w-0.5 bg-white shadow-sm z-10"></div>
          </div>

          <!-- 3-Second Hold Target Fill-Bar -->
          <div class="pt-2">
            <div class="flex justify-between text-xs font-mono text-slate-400 mb-1">
              <span>Hold Continuous Scream (3.0s):</span>
              <span id="hold-time-text" class="text-yellow-400 font-bold">0.0s / 3.0s</span>
            </div>
            <div class="w-full bg-slate-800 h-6 rounded-lg overflow-hidden border-2 border-slate-700 p-0.5">
              <div id="hold-progress-bar" class="h-full bg-yellow-400 rounded transition-all duration-75 w-0"></div>
            </div>
          </div>

          <!-- Status Message -->
          <div id="scream-status-msg" class="text-xs font-mono text-slate-400 min-h-[24px]">
            Waiting for acoustic input...
          </div>
        </div>

        <!-- Fallback Skip Option -->
        <div class="mt-6 pt-4 border-t border-slate-800">
          <button id="btn-skip-scream" class="text-xs text-slate-500 hover:text-slate-300 underline transition-colors">
            "I am too timid to scream into my computer (Skip)"
          </button>
        </div>
      </div>
    </div>
  `;

  const btnStartMic = document.getElementById('btn-start-mic');
  const micPromptBox = document.getElementById('mic-prompt-box');
  const meterContainer = document.getElementById('meter-container');
  const liveDbText = document.getElementById('live-db-text');
  const dbBar = document.getElementById('db-bar');
  const holdTimeText = document.getElementById('hold-time-text');
  const holdProgressBar = document.getElementById('hold-progress-bar');
  const screamStatusMsg = document.getElementById('scream-status-msg');
  const btnSkip = document.getElementById('btn-skip-scream');

  let audioStream = null;
  let audioContext = null;
  let analyser = null;
  let animationId = null;
  let holdSeconds = 0;
  let lastTimestamp = null;
  let completed = false;

  async function startAudio() {
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(audioStream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);

      micPromptBox.classList.add('hidden');
      meterContainer.classList.remove('hidden');

      lastTimestamp = performance.now();
      processAudio();
    } catch (err) {
      console.warn('Microphone access denied or unavailable:', err);
      screamStatusMsg.textContent = 'Microphone access blocked. Use the fallback link below.';
      screamStatusMsg.classList.add('text-red-400');
    }
  }

  function processAudio() {
    if (completed) return;

    const now = performance.now();
    const dt = (now - lastTimestamp) / 1000;
    lastTimestamp = now;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const v = (dataArray[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / dataArray.length);

    // Approximate calibrated dB scale (30 dB background to 110 dB scream)
    let currentDb = rms > 0.0005 ? Math.min(115, Math.max(25, 20 * Math.log10(rms) + 98)) : 25;

    // Track peak volume
    if (currentDb > window.gameState.screamMaxDb) {
      window.gameState.screamMaxDb = currentDb;
    }

    liveDbText.textContent = Math.round(currentDb);
    // Gauge percentage (25 dB = 0%, 110 dB = 100%)
    const gaugePct = Math.min(100, Math.max(0, ((currentDb - 25) / (110 - 25)) * 100));
    dbBar.style.width = `${gaugePct}%`;

    // 80 dB Threshold logic
    if (currentDb >= 80) {
      holdSeconds += dt;
      const pct = Math.min(100, (holdSeconds / 3.0) * 100);
      holdProgressBar.style.width = `${pct}%`;
      holdTimeText.textContent = `${holdSeconds.toFixed(1)}s / 3.0s`;
      screamStatusMsg.textContent = '🔥 SCREAM DETECTED! KEEP HOLDING IT!';
      screamStatusMsg.className = 'text-xs font-mono font-bold text-yellow-400 animate-pulse';

      if (holdSeconds >= 3.0) {
        completeStage();
        return;
      }
    } else {
      // Audio dropped below 80 dB!
      if (holdSeconds > 0.2) {
        // Punish drop with error buzzer & instant reset
        window.soundEngine.playErrorBuzzer();
        screamStatusMsg.textContent = 'Insufficient volume. Scream like you mean it.';
        screamStatusMsg.className = 'text-xs font-mono font-bold text-red-500 animate-bounce';
      }
      holdSeconds = 0;
      holdProgressBar.style.width = '0%';
      holdTimeText.textContent = '0.0s / 3.0s';
    }

    animationId = requestAnimationFrame(processAudio);
  }

  function cleanup() {
    if (animationId) cancelAnimationFrame(animationId);
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
    }
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close();
    }
  }

  function completeStage() {
    if (completed) return;
    completed = true;
    cleanup();

    window.soundEngine.playSuccessChime();
    screamStatusMsg.textContent = '✅ LUNG CAPACITY VERIFIED. ADVANCING...';
    screamStatusMsg.className = 'text-xs font-mono font-bold text-green-400';
    holdProgressBar.classList.replace('bg-yellow-400', 'bg-green-500');

    setTimeout(() => {
      onComplete();
    }, 1200);
  }

  btnStartMic.addEventListener('click', () => {
    window.soundEngine.init();
    startAudio();
  });

  btnSkip.addEventListener('click', () => {
    if (window.gameState.screamMaxDb === 0) {
      window.gameState.screamMaxDb = 34; // logged as timid whisper
    }
    cleanup();
    window.soundEngine.playErrorBuzzer();
    onComplete();
  });

  return cleanup;
};
