// Stage 7: Happiness Facial Exam
// Webcam video preview box + "Happiness Meter" artificially capped at 14% ("Forced Smile Detected").
// Pass condition: clicking the subtle low-contrast text link "I can't take this anymore"
// Fallback: Skip link if camera access is denied.

window.initStage7 = function(container, onComplete) {
  let videoStream = null;
  let isCompleted = false;

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center p-3 sm:p-4 max-w-lg mx-auto w-full select-none">
      
      <!-- Biometric Terminal Card -->
      <div class="w-full bg-[#0d0507] border-2 border-red-950/80 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-red-950 pb-3 mb-4">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            <span class="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider">
              BIOMETRIC FACIAL EMOTION SCANNER v4.2
            </span>
          </div>
          <span class="text-[10px] font-mono text-zinc-500">STAGE 7 / 10</span>
        </div>

        <div class="text-center mb-4">
          <h2 class="text-lg sm:text-xl font-black text-white font-mono">Verification: Human Happiness Exam</h2>
          <p class="text-xs text-zinc-400 mt-1">
            Robots cannot feel genuine joy. Please smile broadly into your camera to calibrate dopamine response.
          </p>
        </div>

        <!-- Video Stream Viewport -->
        <div class="relative w-full aspect-video bg-black rounded-xl overflow-hidden border-2 border-red-950/80 shadow-inner flex items-center justify-center mb-4">
          
          <!-- Webcam Video Element -->
          <video id="webcam-feed" autoplay playsinline muted class="w-full h-full object-cover transform -scale-x-100"></video>
          
          <!-- Simulated / Placeholder Face Mesh if Camera Off -->
          <div id="cam-placeholder" class="absolute inset-0 flex flex-col items-center justify-center p-4 bg-[#080203]">
            <div class="w-20 h-20 rounded-full border-2 border-dashed border-red-600/60 flex items-center justify-center text-3xl mb-2 animate-pulse">
              🙂
            </div>
            <button id="btn-request-cam" class="px-4 py-2 bg-gradient-to-r from-red-800 to-rose-700 hover:from-red-700 hover:to-rose-600 text-white text-xs font-mono font-bold rounded-xl border border-red-600/60 shadow-lg shadow-red-950/50 transition-all cursor-pointer">
              Initialize Camera Stream
            </button>
            <span class="text-[10px] text-zinc-500 mt-2">(Click to enable webcam)</span>
          </div>

          <!-- Futuristic HUD Overlay -->
          <div class="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
            <div class="flex justify-between text-[9px] font-mono text-rose-400">
              <span>FACE_TRACK: ACTIVE</span>
              <span>ZYGOMATICUS_MAJOR: CALIBRATING</span>
            </div>

            <!-- Face Reticle Target Box -->
            <div class="w-40 h-40 sm:w-48 sm:h-48 border border-red-500/40 rounded-lg mx-auto relative flex items-center justify-center">
              <div class="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-red-500"></div>
              <div class="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-red-500"></div>
              <div class="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-red-500"></div>
              <div class="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-red-500"></div>
              <span class="text-[9px] font-mono text-rose-300/80 uppercase font-bold">ALIGN SMILE HERE</span>
            </div>

            <div class="flex justify-between text-[9px] font-mono text-cyan-400">
              <span id="fps-counter">SCAN_RATE: 60 FPS</span>
              <span id="emotion-status-hud">EMOTION: NEUTRAL</span>
            </div>
          </div>

        </div>

        <!-- Happiness Meter (Capped at 14%!) -->
        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-xs font-mono">
            <span class="text-slate-300 font-bold">AUTHENTIC HAPPINESS METER:</span>
            <span id="happiness-score-text" class="text-cyan-400 font-bold">0% / 100%</span>
          </div>

          <div class="w-full bg-slate-800 h-5 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div id="happiness-bar" class="h-full bg-gradient-to-r from-red-500 via-amber-400 to-green-500 rounded-full transition-all duration-300 w-0"></div>
          </div>

          <div id="happiness-status-msg" class="text-xs font-mono text-center min-h-[20px] text-yellow-400">
            Awaiting genuine facial smile...
          </div>
        </div>

        <!-- Try Smile Button -->
        <div class="text-center mb-6">
          <button id="btn-analyze-smile" class="px-5 py-2.5 bg-gradient-to-r from-red-800 to-rose-700 hover:from-red-700 hover:to-rose-600 text-white text-xs font-mono font-bold rounded-xl border border-red-600/60 shadow-lg shadow-red-950/50 transition-all transform active:scale-95 cursor-pointer">
            😁 Verify Current Smile
          </button>
        </div>

        <!-- Footer With Subtle Low-Contrast Secret Pass Link & Skip Link -->
        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
          <!-- Fallback Skip Link -->
          <button id="btn-skip-cam" class="text-slate-500 hover:text-slate-400 underline transition-colors">
            Camera unavailable / Skip test
          </button>

          <!-- The Subtle Low-Contrast Rage Link (The Real Pass Condition!) -->
          <button id="btn-frustration-pass" class="text-slate-700 hover:text-slate-400 transition-colors cursor-pointer select-none font-sans italic">
            I can't take this anymore
          </button>
        </div>

      </div>
    </div>
  `;

  const videoEl = document.getElementById('webcam-feed');
  const camPlaceholder = document.getElementById('cam-placeholder');
  const btnRequestCam = document.getElementById('btn-request-cam');
  const btnAnalyzeSmile = document.getElementById('btn-analyze-smile');
  const happinessBar = document.getElementById('happiness-bar');
  const happinessScoreText = document.getElementById('happiness-score-text');
  const happinessStatusMsg = document.getElementById('happiness-status-msg');
  const btnFrustrationPass = document.getElementById('btn-frustration-pass');
  const btnSkipCam = document.getElementById('btn-skip-cam');
  const hudEmotion = document.getElementById('emotion-status-hud');

  let smileAttempts = 0;

  async function startWebcam() {
    try {
      videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoEl.srcObject = videoStream;
      camPlaceholder.classList.add('hidden');
    } catch (err) {
      console.warn('Webcam not permitted or missing:', err);
      camPlaceholder.innerHTML = `
        <div class="text-center p-3">
          <p class="text-xs font-mono text-amber-400 mb-2">Webcam hardware bypass active.</p>
          <p class="text-[11px] text-slate-400">You can still proceed with the smile analysis button or fallback.</p>
        </div>
      `;
    }
  }

  btnRequestCam.addEventListener('click', () => {
    startWebcam();
  });

  // Analyze smile button: ARTIFICIALLY CAPS AT 14%!
  btnAnalyzeSmile.addEventListener('click', () => {
    smileAttempts++;

    // Artificial ragebait cap at 14%
    const targetVal = smileAttempts === 1 ? 14 : 14 + (Math.random() * 0.4 - 0.2);
    const rounded = targetVal.toFixed(1);

    happinessBar.style.width = `${rounded}%`;
    happinessScoreText.textContent = `${rounded}% / 100%`;

    window.soundEngine.playErrorBuzzer();

    if (smileAttempts === 1) {
      happinessStatusMsg.textContent = '❌ Forced Smile Detected. Dopamine levels deficient (14%). Please smile more genuinely.';
      happinessStatusMsg.className = 'text-xs font-mono text-center font-bold text-red-400 animate-pulse';
      hudEmotion.textContent = 'EMOTION: FORCED_FAKE_SMILE';
    } else if (smileAttempts === 2) {
      happinessStatusMsg.textContent = '❌ Excessive facial tension detected. Happiness algorithm rejected expression.';
      happinessStatusMsg.className = 'text-xs font-mono text-center font-bold text-red-400 animate-pulse';
      hudEmotion.textContent = 'EMOTION: ARTIFICIAL_CONTORTION';
    } else {
      happinessStatusMsg.textContent = '❌ Error 418: Emotional insincerity. Are you even capable of genuine joy?';
      happinessStatusMsg.className = 'text-xs font-mono text-center font-bold text-red-500 animate-bounce';
      hudEmotion.textContent = 'EMOTION: COMPLETE_DESPAIR';
    }
  });

  function cleanup() {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }
  }

  // PASS CONDITION: User clicks "I can't take this anymore"
  btnFrustrationPass.addEventListener('click', () => {
    if (isCompleted) return;
    isCompleted = true;
    cleanup();

    window.soundEngine.playSuccessChime();

    happinessBar.style.width = '100%';
    happinessBar.classList.replace('from-red-500', 'from-green-500');
    happinessScoreText.textContent = '100% (FRUSTRATION)';
    happinessStatusMsg.textContent = '✅ GENUINE HUMAN FRUSTRATION CONFIRMED! No robot feels this level of irritation.';
    happinessStatusMsg.className = 'text-xs font-mono text-center font-bold text-green-400 animate-pulse';

    setTimeout(() => {
      onComplete();
    }, 1400);
  });

  // Fallback Skip
  btnSkipCam.addEventListener('click', () => {
    if (isCompleted) return;
    isCompleted = true;
    cleanup();
    onComplete();
  });

  return cleanup;
};
