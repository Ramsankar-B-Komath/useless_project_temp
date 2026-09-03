// Stage 4: Realistic Human Breakup Simulator
// Deeply emotional, raw, authentic relationship conversation without coding puns.
// Soft or wavering choices trigger reconciliation & FAILED TO BREAK UP overlay.
// Only strict, firm choices successfully navigate to the painful final separation.

window.initStage4 = function(container, onComplete) {
  const DIALOGUE_TREE = [
    // Exchange 1
    {
      partnerMessage: "I saw you packing that suitcase by the closet this morning while you thought I was still asleep. Are you really doing this right now?",
      options: [
        { text: "I'm sorry... I didn't want you to wake up like that. Let's talk about it.", soft: true },
        { text: "Yes, Rias. We need to talk. I'm moving out, and we're breaking up.", firm: true },
        { text: "It's just some old clothes, you're overthinking it babe.", soft: true }
      ]
    },
    // Exchange 2
    {
      partnerMessage: "Breaking up?! After three years together?! We just signed the lease renewal last month! You looked me in the eyes and told me you saw a future with me. Did all of that mean nothing to you?!",
      options: [
        { text: "It meant everything to me, it really did... I'm just under so much stress lately.", soft: true },
        { text: "I cared about you, but we both know this hasn't been working for a long time. My decision is final.", firm: true },
        { text: "I never wanted to hurt you, maybe we rushed into the lease...", soft: true }
      ]
    },
    // Exchange 3
    {
      partnerMessage: "Hasn't been working?! Every couple goes through rough patches! I gave up the promotion in Seattle so we wouldn't have to do long distance! I reorganized my entire life around you! How can you throw all that away over a rough couple of months?!",
      options: [
        { text: "You made that choice, Rias, and I never asked you to sacrifice your career. We are fundamentally incompatible, and I cannot stay.", firm: true },
        { text: "I know how much you sacrificed for me, and I feel horrible about it every single day...", soft: true },
        { text: "Maybe we just need a few weeks of space to clear our heads?", soft: true }
      ]
    },
    // Exchange 4
    {
      partnerMessage: "I don't care about the career, I care about US! Please... I'll stop bringing up marriage, I'll give you more space, we can go to couples counseling—whatever you need. Just tell me what I have to do to fix this. Please don't leave me.",
      options: [
        { text: "Don't beg, Rias... seeing you like this is breaking my heart.", soft: true },
        { text: "If you really think couples counseling could help us understand each other...", soft: true },
        { text: "There is nothing to fix. I don't want counseling, and I don't want you to change who you are. I want this relationship to end.", firm: true }
      ]
    },
    // Exchange 5
    {
      partnerMessage: "Is there someone else? Just be honest with me. That new girl from your office? Is that why you've been putting your phone face-down every night at dinner? Tell me the truth!",
      options: [
        { text: "There is nobody else, Rias. This is entirely about you and me, and I'm tired of the constant distrust.", firm: true },
        { text: "You know I would never cheat on you, you're the only person I've loved...", soft: true },
        { text: "I swear on my life there's no one else, please believe me.", soft: true }
      ]
    },
    // Exchange 6
    {
      partnerMessage: "Then look me in the eyes when you come home tonight and tell me you don't love me anymore. Say the words: 'I don't love you.' Say it right now, and I swear I'll pack my things and never call you again.",
      options: [
        { text: "I can't say that because you know I still care about you deeply...", soft: true },
        { text: "I don't love you anymore, Rias. It's over. Please don't be there when I come to get the rest of my boxes.", firm: true },
        { text: "Why are you making this so painful for both of us?", soft: true }
      ]
    },
    // Exchange 7
    {
      partnerMessage: "You're really doing this. You're really walking away from everything we built like it was garbage. I gave you three of the best years of my life.",
      options: [
        { text: "I am leaving. Goodbye, Rias. I wish you the best.", firm: true },
        { text: "I will always cherish those three years, Rias, you'll always have a place in my heart.", soft: true },
        { text: "I'm sorry for everything, maybe one day you can forgive me.", soft: true }
      ]
    }
  ];

  let currentExchangeIdx = 0;

  function renderApp() {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center p-2 sm:p-4 max-w-md mx-auto w-full select-none">
        <!-- Modern Smartphone UI Shell -->
        <div class="w-full bg-[#0b0406] rounded-3xl shadow-2xl border-4 border-red-950/90 overflow-hidden flex flex-col h-[580px] relative">
          
          <!-- Chat Header -->
          <div class="bg-[#140609]/95 backdrop-blur border-b border-red-950 p-3.5 flex items-center justify-between z-10">
            <div class="flex items-center space-x-3">
              <div class="relative">
                <div class="w-11 h-11 rounded-full overflow-hidden border-2 border-red-500/70 shadow-md">
                  <img src="assets/images/rias_pfp.png" alt="Rias" class="w-full h-full object-cover" />
                </div>
                <span id="chat-status-dot" class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#140609] rounded-full"></span>
              </div>
              <div>
                <h3 class="text-sm font-bold text-white leading-tight font-mono">Rias ❤️</h3>
                <p id="chat-status-text" class="text-[10px] text-emerald-400 font-mono">Active now</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-[9px] font-mono text-zinc-400 block uppercase">Failures</span>
              <span id="fail-count-badge" class="text-xs font-mono font-bold text-rose-400">${window.gameState.breakupFailCount}</span>
            </div>
          </div>

          <!-- Messages Scroll Area -->
          <div id="chat-messages" class="flex-1 p-3.5 overflow-y-auto space-y-3.5 chat-scroll bg-[#070203]">
            <!-- Messages rendered dynamically -->
          </div>

          <!-- Typing Indicator -->
          <div id="typing-indicator" class="hidden px-4 py-1.5 bg-transparent text-zinc-400 text-xs font-mono flex items-center space-x-1.5">
            <span>Rias is typing</span>
            <span class="inline-flex space-x-1">
              <span class="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce"></span>
              <span class="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span class="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </span>
          </div>

          <!-- Decision Options Container -->
          <div id="choices-container" class="bg-[#120508]/95 border-t border-red-950 p-3 space-y-2 z-10">
            <!-- Buttons dynamically generated -->
          </div>

          <!-- FAILED TO BREAK UP Overlay -->
          <div id="failed-overlay" class="hidden absolute inset-0 bg-[#070203]/95 z-30 flex flex-col items-center justify-center p-6 text-center animate-fade-in backdrop-blur-sm border-2 border-red-950">
            <div class="text-4xl mb-3">💔</div>
            <h2 class="text-xl sm:text-2xl font-black text-rose-400 tracking-wider mb-2 font-mono">FAILED TO BREAK UP</h2>
            <p id="fail-reason-text" class="text-xs text-rose-200 mb-5 font-mono italic max-w-xs">
              "I knew you still loved me. Come home tonight, we'll talk through everything together. I forgive you baby ❤️"
            </p>
            <p class="text-[11px] text-zinc-400 mb-6 max-w-xs">
              You wavered under emotional pressure. To break an unhealthy bond, you must set clear, unwavering boundaries without backtracking.
            </p>
            <button id="btn-reset-stage4" class="px-5 py-2.5 bg-gradient-to-r from-red-800 to-rose-700 hover:from-red-700 hover:to-rose-600 text-white font-mono font-bold text-xs rounded-xl border border-red-600/60 shadow-lg shadow-red-950/50 transition-all transform active:scale-95 cursor-pointer">
              🔄 Reset Stage 4 (Restart From Exchange 1)
            </button>
          </div>

        </div>
      </div>
    `;

    document.getElementById('btn-reset-stage4')?.addEventListener('click', () => {
      resetStage();
    });

    startExchange(0);
  }

  function appendMessage(sender, text) {
    const chatContainer = document.getElementById('chat-messages');
    if (!chatContainer) return;

    const bubble = document.createElement('div');
    if (sender === 'rias') {
      bubble.className = 'flex items-end space-x-2 max-w-[85%]';
      bubble.innerHTML = `
        <div class="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-red-500/60 shadow-sm">
          <img src="assets/images/rias_pfp.png" alt="Rias" class="w-full h-full object-cover" />
        </div>
        <div class="bg-[#140608] text-zinc-200 text-xs sm:text-sm p-3 rounded-2xl rounded-bl-sm border border-red-950/80 shadow-sm leading-relaxed font-sans">
          ${text}
        </div>
      `;
      window.soundEngine.playMessageDing();
    } else {
      bubble.className = 'flex justify-end';
      bubble.innerHTML = `
        <div class="bg-[#420d15] text-rose-100 text-xs sm:text-sm p-3 rounded-2xl rounded-br-sm border border-red-900/60 shadow-sm max-w-[85%] leading-relaxed font-sans">
          ${text}
        </div>
      `;
    }
    chatContainer.appendChild(bubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function startExchange(index) {
    currentExchangeIdx = index;
    const typingIndicator = document.getElementById('typing-indicator');
    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = '';

    if (index >= DIALOGUE_TREE.length) {
      triggerFinalBreakup();
      return;
    }

    const currentExchange = DIALOGUE_TREE[index];
    typingIndicator.classList.remove('hidden');

    setTimeout(() => {
      typingIndicator.classList.add('hidden');
      appendMessage('rias', currentExchange.partnerMessage);

      choicesContainer.innerHTML = '';
      currentExchange.options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'w-full text-left p-2.5 rounded-xl text-xs font-medium bg-[#1e0a0f] hover:bg-[#2e0e15] text-zinc-100 border border-red-950/80 hover:border-red-800/80 active:scale-[0.99] transition-all flex items-center justify-between group cursor-pointer';
        btn.innerHTML = `
          <span class="leading-snug pr-2 font-sans">${opt.text}</span>
          <span class="text-rose-400 group-hover:text-rose-300 transition-colors shrink-0">➔</span>
        `;
        btn.addEventListener('click', () => handleChoice(opt));
        choicesContainer.appendChild(btn);
      });
    }, 900);
  }

  function handleChoice(option) {
    appendMessage('user', option.text);
    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = '';

    if (option.soft) {
      setTimeout(() => {
        appendMessage('rias', "I knew you didn't mean it... I know you're just overwhelmed right now. Come home tonight, we'll talk through everything together. I forgive you baby ❤️");
        window.soundEngine.playErrorBuzzer();
        window.gameState.breakupFailCount++;

        setTimeout(() => {
          const overlay = document.getElementById('failed-overlay');
          const countBadge = document.getElementById('fail-count-badge');
          if (countBadge) countBadge.textContent = window.gameState.breakupFailCount;
          if (overlay) overlay.classList.remove('hidden');
        }, 900);
      }, 800);
    } else {
      setTimeout(() => {
        startExchange(currentExchangeIdx + 1);
      }, 800);
    }
  }

  function triggerFinalBreakup() {
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.classList.remove('hidden');

    setTimeout(() => {
      typingIndicator.classList.add('hidden');
      appendMessage('rias', "FINE. WE'RE OVER. DON'T TEXT ME AGAIN.");

      const statusDot = document.getElementById('chat-status-dot');
      const statusText = document.getElementById('chat-status-text');
      if (statusDot) statusDot.className = 'absolute bottom-0 right-0 w-2.5 h-2.5 bg-slate-500 border-2 border-slate-800 rounded-full';
      if (statusText) {
        statusText.textContent = 'Blocked you • Chat terminated';
        statusText.className = 'text-[10px] text-rose-400 font-mono font-bold';
      }

      window.soundEngine.playSuccessChime();

      setTimeout(() => {
        onComplete();
      }, 1800);
    }, 1100);
  }

  function resetStage() {
    renderApp();
  }

  renderApp();
};
