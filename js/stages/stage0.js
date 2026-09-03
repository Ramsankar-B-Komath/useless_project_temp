// Stage 0: The Bait Checkbox
// Classic reCAPTCHA v2 mock that immediately flags the user as suspicious

window.initStage0 = function(container, onComplete) {
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center p-8">
      <div class="mb-4 text-center">
        <h2 class="text-xl font-bold text-slate-800 tracking-tight">Security Check</h2>
        <p class="text-sm text-slate-500">Please confirm that you are not an automated program.</p>
      </div>

      <!-- reCAPTCHA v2 Card -->
      <div id="recaptcha-card" class="bg-[#f9f9f9] border border-[#d3d3d3] rounded-sm p-4 w-72 sm:w-80 shadow-md flex items-center justify-between transition-all duration-200 select-none">
        <div class="flex items-center space-x-3">
          <button id="recaptcha-anchor" class="w-7 h-7 bg-white border-2 border-[#c1c1c1] rounded-sm hover:border-[#b2b2b2] flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
            <span id="recaptcha-spinner" class="hidden w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
          </button>
          <span class="text-sm font-medium text-slate-700 select-none">I'm not a robot</span>
        </div>

        <div class="flex flex-col items-center justify-center pl-2">
          <!-- reCAPTCHA Logo SVG -->
          <svg class="w-8 h-8 text-blue-500" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C35.05 44 44 35.05 44 24" stroke="#4285F4" stroke-width="4" stroke-linecap="round"/>
            <path d="M44 14V4H34" stroke="#4285F4" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="24" cy="24" r="6" fill="#4285F4"/>
          </svg>
          <span class="text-[9px] font-semibold text-slate-400 leading-tight">reCAPTCHA</span>
          <div class="text-[8px] text-slate-400 flex space-x-1">
            <span>Privacy</span>
            <span>•</span>
            <span>Terms</span>
          </div>
        </div>
      </div>

      <!-- Error Alert Message -->
      <div id="stage0-alert" class="hidden mt-6 max-w-sm p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-mono shadow-sm rounded-r transition-opacity duration-300">
        <div class="flex items-center font-bold mb-1">
          <svg class="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          SECURITY EXCEPTION #403-HUMAN
        </div>
        <p id="stage0-alert-text">Suspicious human click signature detected. Proceeding to extended verification.</p>
      </div>
    </div>
  `;

  const btn = document.getElementById('recaptcha-anchor');
  const card = document.getElementById('recaptcha-card');
  const spinner = document.getElementById('recaptcha-spinner');
  const alertBox = document.getElementById('stage0-alert');

  let clicked = false;

  btn.addEventListener('click', () => {
    if (clicked) return;
    clicked = true;

    // Show spinner briefly
    spinner.classList.remove('hidden');

    setTimeout(() => {
      spinner.classList.add('hidden');
      card.classList.add('flash-red');
      document.body.classList.add('shake-active');
      setTimeout(() => document.body.classList.remove('shake-active'), 400);

      // Play harsh buzzer
      window.soundEngine.playErrorBuzzer();

      // Show alert box
      alertBox.classList.remove('hidden');

      // Advance to Stage 1 after brief shock
      setTimeout(() => {
        onComplete();
      }, 1600);
    }, 450);
  });
};
