/* ============================================================
   IL PANINO PERFETTO — game.js
   ────────────────────────────────────────────────────────────
   Struttura:
     §0  Costanti & Dati
     §1  Riferimenti DOM
     §2  Stato di gioco
     §3  Audio (Web Audio API — nessun file esterno)
     §4  Particelle sfondo
     §5  Timer
     §6  Combo Storage (localStorage con validazione)
     §7  Bambino — Reazioni
     §8  Errori — Indicatore
     §9  Ingredienti — Griglia
     §10 Selezione ingrediente
     §11 Panino completo
     §12 Reset panino
     §13 Vittoria
     §14 Game Over
     §15 Confetti
     §16 Navigazione schermate
     §17 Event Listeners
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {


/* ============================================================
   §0  COSTANTI & DATI
   ============================================================ */
const MAX_SLOTS     = 3;
const MAX_ERRORS    = 3;
const GAME_TIME     = 60;
const ANIM_COOLDOWN = 1500;
const COMBO_KEY     = 'panino_combos';
const HOME_URL      = new URL('../../index.html', window.location.href).href;

const FOODS = [
  /* ── Corretti (sani per un panino) ── */
  { id: 'pomodoro',    emoji: '🍅', name: 'Pomodoro',         correct: true },
  { id: 'lattuga',     emoji: '🥬', name: 'Lattuga',          correct: true },
  { id: 'mozzarella',  emoji: '🧀', name: 'Mozzarella',       correct: true },
  { id: 'prosciutto',  emoji: '🥩', name: 'Prosciutto cotto', correct: true },
  { id: 'tonno',       emoji: '🐟', name: 'Tonno',            correct: true },
  { id: 'uovo',        emoji: '🥚', name: 'Uovo sodo',        correct: true },
  { id: 'cetriolo',    emoji: '🥒', name: 'Cetriolo',         correct: true },
  { id: 'carota',      emoji: '🥕', name: 'Carota',           correct: true },
  /* ── Errati (non adatti a un panino sano) ── */
  { id: 'patatine',    emoji: '🍟', name: 'Patatine fritte',  correct: false },
  { id: 'cioccolato',  emoji: '🍫', name: 'Cioccolato',       correct: false },
  { id: 'caramella',   emoji: '🍬', name: 'Caramella',        correct: false },
  { id: 'gelato',      emoji: '🍦', name: 'Gelato',           correct: false },
  { id: 'ciambella',   emoji: '🍩', name: 'Ciambella',        correct: false },
  { id: 'leccalecca',  emoji: '🍭', name: 'Lecca-lecca',      correct: false },
  { id: 'cupcake',     emoji: '🧁', name: 'Cupcake',          correct: false },
  { id: 'bibita',      emoji: '🥤', name: 'Bibita gassata',   correct: false },
];

const HAPPY = [
  'Buona scelta! 👍', 'Ottimo! 🎉', 'Che buono! 😋',
  'Perfetto! ⭐',     'Bravo! 💪',  'Sano e gustoso! 🌟',
];

const SAD = [
  'Bleah! 🤢',         'Non nel panino! 🙅', 'Nooo! 😱',
  'Non è sano! 😵',    'Sbagliato! 💔',      'Questo no! 🤮',
];


/* ============================================================
   §1  RIFERIMENTI DOM
   ============================================================ */
const $ = id => document.getElementById(id);

const DOM = {
  startScreen : $('start-screen'),
  gameScreen  : $('game-screen'),
  winScreen   : $('win-screen'),
  lossScreen  : $('loss-screen'),
  confirmHome : $('confirm-home'),
  aboutPanel  : $('about-panel'),
  btnStart    : $('btn-start'),
  btnHome     : $('btn-home'),
  timerText   : $('timer-text'),
  child       : $('child'),
  childFace   : $('child-face'),
  childSpeech : $('child-speech'),
  speechText  : $('speech-text'),
  breadTop    : $('bread-top'),
  sandwich    : $('sandwich'),
  grid        : $('ingredients-grid'),
  confetti    : $('confetti-container'),
  lossTitle   : $('loss-title'),
  lossDesc    : $('loss-desc'),
  particles   : $('particles'),
};


/* ============================================================
   §2  STATO DI GIOCO
   ============================================================ */
const S = {
  placed        : [],
  errors        : 0,
  animating     : false,
  timer         : GAME_TIME,
  timerInterval : null,
  active        : false,
  speechTid     : null,
};


/* ============================================================
   §3  AUDIO (Web Audio API — nessun file esterno)
   ============================================================ */
const AUDIO = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function beep(freq, dur, type, vol) {
    try {
      const c = getCtx();
      const o = c.createOscillator();
      const g = c.createGain();
      o.type            = type || 'sine';
      o.frequency.value = freq;
      g.gain.value      = vol  || 0.22;
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      o.connect(g);
      g.connect(c.destination);
      o.start();
      o.stop(c.currentTime + dur);
    } catch { /* audio non supportato */ }
  }

  return {
    correct() {
      beep(523, 0.12);
      setTimeout(() => beep(659, 0.12), 100);
      setTimeout(() => beep(784, 0.25), 200);
    },
    wrong() {
      beep(220, 0.25, 'sawtooth', 0.15);
      setTimeout(() => beep(170, 0.35, 'sawtooth', 0.12), 150);
    },
    win() {
      [523, 587, 659, 784, 1047].forEach((f, i) =>
        setTimeout(() => beep(f, 0.2), i * 130));
    },
    lose() {
      [350, 300, 250, 200].forEach((f, i) =>
        setTimeout(() => beep(f, 0.3, 'sawtooth', 0.1), i * 180));
    },
    seal() {
      beep(400, 0.1, 'triangle', 0.15);
      setTimeout(() => beep(520, 0.15, 'triangle', 0.15), 80);
    },
  };
})();


/* ============================================================
   §4  PARTICELLE SFONDO
   ============================================================ */
(function initParticles() {
  const pool = ['🥗','🍎','🥦','🥪','🍞','🧀','🍅','🥬','🥒','🥕'];
  for (let i = 0; i < 14; i++) {
    const el = document.createElement('span');
    el.className = 'bg-particle';
    el.textContent = pool[Math.floor(Math.random() * pool.length)];
    el.style.left              = `${Math.random() * 100}%`;
    el.style.animationDuration = `${10 + Math.random() * 15}s`;
    el.style.animationDelay    = `${Math.random() * 10}s`;
    el.style.fontSize          = `${14 + Math.random() * 18}px`;
    DOM.particles.appendChild(el);
  }
})();


/* ============================================================
   §5  TIMER
   ============================================================ */
function fmtTime(sec) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

function startTimer() {
  S.timer = GAME_TIME;
  DOM.timerText.textContent = fmtTime(S.timer);
  DOM.timerText.classList.remove('urgent');

  S.timerInterval = setInterval(() => {
    if (--S.timer <= 10) DOM.timerText.classList.add('urgent');
    DOM.timerText.textContent = fmtTime(S.timer);
    if (S.timer <= 0) { clearInterval(S.timerInterval); endGame('time'); }
  }, 1000);
}

function stopTimer() { clearInterval(S.timerInterval); }


/* ============================================================
   §6  COMBO STORAGE (localStorage con validazione)
   ============================================================ */
function loadCombos() {
  try {
    const raw = localStorage.getItem(COMBO_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) throw 0;
    return arr.filter(c =>
      Array.isArray(c) && c.length === MAX_SLOTS &&
      c.every(id => typeof id === 'string'));
  } catch {
    localStorage.removeItem(COMBO_KEY);
    return [];
  }
}

function saveCombo(ids) {
  const combos = loadCombos();
  combos.push([...ids].sort());
  localStorage.setItem(COMBO_KEY, JSON.stringify(combos));
}

function isDuplicate(ids) {
  const key = [...ids].sort();
  return loadCombos().some(c =>
    c.length === key.length && c.every((v, i) => v === key[i]));
}


/* ============================================================
   §7  BAMBINO — REAZIONI
   ============================================================ */
function childSay(type, msg) {
  clearTimeout(S.speechTid);

  DOM.child.classList.remove('happy', 'sad', 'idle');
  void DOM.child.offsetWidth;          // forza reflow per re-trigger animazione

  DOM.childFace.textContent = type === 'happy' ? '🤩' : type === 'sad' ? '🤪' : '😊';
  if (type) DOM.child.classList.add(type);

  DOM.speechText.textContent = msg;
  DOM.childSpeech.removeAttribute('hidden');

  S.speechTid = setTimeout(() => {
    DOM.childFace.textContent = '😊';
    DOM.child.classList.remove('happy', 'sad');
    DOM.child.classList.add('idle');
    DOM.childSpeech.setAttribute('hidden', '');
  }, ANIM_COOLDOWN);
}


/* ============================================================
   §8  ERRORI — INDICATORE
   ============================================================ */
function updateDots() {
  for (let i = 1; i <= MAX_ERRORS; i++) {
    const d = $(`err-${i}`);
    if (d) d.classList.toggle('active', i <= S.errors);
  }
}


/* ============================================================
   §9  INGREDIENTI — GRIGLIA
   ============================================================ */
function shuffle(arr) {
  const b = [...arr];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

function buildGrid() {
  DOM.grid.textContent = '';

  shuffle(FOODS).forEach(food => {
    const btn = document.createElement('button');
    btn.className = 'ing-btn';
    btn.dataset.id = food.id;
    btn.setAttribute('aria-label', food.name);

    const em = document.createElement('span');
    em.className = 'ing-emoji';
    em.setAttribute('aria-hidden', 'true');
    em.textContent = food.emoji;

    const nm = document.createElement('span');
    nm.className = 'ing-name';
    nm.textContent = food.name;

    btn.appendChild(em);
    btn.appendChild(nm);
    btn.addEventListener('click', () => pickIngredient(food, btn));
    DOM.grid.appendChild(btn);
  });
}


/* ============================================================
   §10 SELEZIONE INGREDIENTE
   ============================================================ */
function pickIngredient(food, btn) {
  if (!S.active || S.animating || S.placed.length >= MAX_SLOTS || btn.disabled) return;

  S.animating = true;
  btn.disabled = true;
  btn.classList.add('used');

  const slotIdx = S.placed.length + 1;
  const slot    = $(`slot-${slotIdx}`);

  // Riempi lo slot con animazione (slideIn via CSS)
  const se = document.createElement('span');
  se.className   = 'slot-emoji';
  se.textContent = food.emoji;

  const sn = document.createElement('span');
  sn.className   = 'slot-name';
  sn.textContent = food.name;

  slot.appendChild(se);
  slot.appendChild(sn);
  slot.classList.add('filled', food.correct ? 'slot-ok' : 'slot-ko');

  S.placed.push(food);

  // Reazione del bambino (dopo la slide-in ~450ms)
  setTimeout(() => {
    if (food.correct) {
      AUDIO.correct();
      childSay('happy', HAPPY[Math.floor(Math.random() * HAPPY.length)]);
    } else {
      AUDIO.wrong();
      S.errors++;
      updateDots();
      childSay('sad', SAD[Math.floor(Math.random() * SAD.length)]);

      // Game over per troppi errori
      if (S.errors >= MAX_ERRORS) {
        setTimeout(() => endGame('errors'), ANIM_COOLDOWN);
        return;
      }
    }

    // Panino completo?
    if (S.placed.length >= MAX_SLOTS) {
      setTimeout(sealSandwich, ANIM_COOLDOWN + 200);
    } else {
      setTimeout(() => { S.animating = false; }, ANIM_COOLDOWN);
    }
  }, 450);
}


/* ============================================================
   §11 PANINO COMPLETO
   ============================================================ */
function sealSandwich() {
  if (!S.active) return;

  AUDIO.seal();
  DOM.breadTop.removeAttribute('hidden');
  DOM.breadTop.classList.add('closing');

  setTimeout(() => {
    if (!S.active) return;

    const ids = S.placed.map(f => f.id);

    // Combo già usata?
    if (isDuplicate(ids)) {
      childSay('sad', 'Questo panino l\'hai già fatto! 🔄');
      setTimeout(() => endGame('duplicate'), 5000);
      return;
    }

    // Salva combo
    saveCombo(ids);

    // Tutti corretti → vittoria
    if (S.placed.every(f => f.correct)) {
      setTimeout(gameWin, 600);
    } else {
      // Panino non perfetto → riprova
      childSay('sad', 'Panino non perfetto! Riprova! 🔄');
      setTimeout(resetSandwich, 2200);
    }
  }, 800);
}


/* ============================================================
   §12 RESET PANINO (nuovo tentativo)
   ============================================================ */
function resetSandwich() {
  if (!S.active) return;

  S.placed    = [];
  S.animating = false;

  for (let i = 1; i <= MAX_SLOTS; i++) {
    const slot = $(`slot-${i}`);
    slot.textContent = '';
    slot.className   = 'ingredient-slot';
  }

  DOM.breadTop.setAttribute('hidden', '');
  DOM.breadTop.classList.remove('closing');

  buildGrid();
}


/* ============================================================
   §13 VITTORIA
   ============================================================ */
function gameWin() {
  if (!S.active) return;
  S.active = false;
  stopTimer();
  AUDIO.win();
  launchConfetti();
  DOM.winScreen.removeAttribute('hidden');
}


/* ============================================================
   §14 GAME OVER
   ============================================================ */
function endGame(reason) {
  if (!S.active) return;
  S.active = false;
  stopTimer();
  AUDIO.lose();

  const titles = {
    errors    : 'Game Over!',
    time      : 'Tempo scaduto! ⏱️',
    duplicate : 'Panino già creato! 🔄',
  };
  const descs = {
    errors    : 'Troppi ingredienti sbagliati! La prossima volta scegli più attentamente! 💪',
    time      : 'Il tempo è finito! Riprova e sii più veloce! 🏃',
    duplicate : 'Il panino non è stato creato perché hai già creato un panino così! Prova una combinazione diversa!',
  };

  DOM.lossTitle.textContent = titles[reason] || 'Game Over!';
  DOM.lossDesc.textContent  = descs[reason]  || '';
  DOM.lossScreen.removeAttribute('hidden');
}


/* ============================================================
   §15 CONFETTI
   ============================================================ */
function launchConfetti() {
  DOM.confetti.textContent = '';
  const cols   = ['#ffd600','#ff9800','#e53935','#43a047','#1565c0','#9c27b0','#f06292'];
  const shapes = ['■','●','▲','★','♦','✦'];

  for (let i = 0; i < 65; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.className   = 'confetti-piece';
      el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
      el.style.color             = cols[Math.floor(Math.random() * cols.length)];
      el.style.left              = `${Math.random() * 100}%`;
      el.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      el.style.fontSize          = `${10 + Math.random() * 14}px`;
      DOM.confetti.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, i * 28);
  }
}


/* ============================================================
   §16 NAVIGAZIONE SCHERMATE
   ============================================================ */
function startGame() {
  // Reset stato
  S.placed    = [];
  S.errors    = 0;
  S.animating = false;
  S.active    = true;

  updateDots();

  // Reset bambino
  DOM.childFace.textContent = '😊';
  DOM.child.classList.remove('happy', 'sad');
  DOM.child.classList.add('idle');
  DOM.childSpeech.setAttribute('hidden', '');

  // Reset panino
  DOM.breadTop.setAttribute('hidden', '');
  DOM.breadTop.classList.remove('closing');
  for (let i = 1; i <= MAX_SLOTS; i++) {
    const slot = $(`slot-${i}`);
    slot.textContent = '';
    slot.className   = 'ingredient-slot';
  }

  buildGrid();

  // Mostra schermata di gioco
  [DOM.startScreen, DOM.winScreen, DOM.lossScreen].forEach(s => s.setAttribute('hidden', ''));
  DOM.gameScreen.removeAttribute('hidden');

  startTimer();
}


/* ============================================================
   §17 EVENT LISTENERS
   ============================================================ */

/* ── Start ── */
DOM.btnStart.addEventListener('click', startGame);

/* ── Home ── */
DOM.btnHome.addEventListener('click', () => {
  if (S.active) {
    DOM.confirmHome.removeAttribute('hidden');
    DOM.confirmHome.removeAttribute('aria-hidden');
  } else {
    window.location.href = HOME_URL;
  }
});

$('btn-confirm-yes').addEventListener('click', () => {
  stopTimer();
  S.active = false;
  window.location.href = HOME_URL;
});

$('btn-confirm-no').addEventListener('click', () => {
  DOM.confirmHome.setAttribute('hidden', '');
  DOM.confirmHome.setAttribute('aria-hidden', 'true');
});

/* ── Replay & Home finali ── */
$('btn-replay-win').addEventListener('click', startGame);
$('btn-home-win').addEventListener('click',   () => { window.location.href = HOME_URL; });
$('btn-replay-loss').addEventListener('click', startGame);
$('btn-home-loss').addEventListener('click',   () => { window.location.href = HOME_URL; });

/* ── About ── */
$('btn-about-close').addEventListener('click', () => {
  DOM.aboutPanel.setAttribute('hidden', '');
  DOM.aboutPanel.setAttribute('aria-hidden', 'true');
});

/* ── Tastiera ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!DOM.confirmHome.hasAttribute('hidden')) {
      DOM.confirmHome.setAttribute('hidden', '');
      DOM.confirmHome.setAttribute('aria-hidden', 'true');
    } else if (!DOM.aboutPanel.hasAttribute('hidden')) {
      DOM.aboutPanel.setAttribute('hidden', '');
      DOM.aboutPanel.setAttribute('aria-hidden', 'true');
    }
  }
});


/* ─── fine DOMContentLoaded ─── */
});
