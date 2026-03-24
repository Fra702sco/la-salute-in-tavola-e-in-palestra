'use strict';
/* ================================================================
   PUZZLE DELLA PIRAMIDE — game.js
   ================================================================ */

/* §0 ── CONFIG ──────────────────────────────────────────────── */
const DIFF = {
  easy:   { foods: 10, maxErrors: 5 },
  medium: { foods: 15, maxErrors: 4 },
  hard:   { foods: 20, maxErrors: 3 },
};

/* §1 ── DATABASE ALIMENTI (5 livelli piramide) ────────────── */
const PYRAMID_FOODS = {
  /* Livello 1 — BASE: Cereali, pane, pasta, riso */
  1: [
    { emoji: '🍞', name: 'Pane' },
    { emoji: '🍝', name: 'Pasta' },
    { emoji: '🍚', name: 'Riso' },
    { emoji: '🥯', name: 'Cereali' },
    { emoji: '🌾', name: 'Grano' },
    { emoji: '🥔', name: 'Patata' },
    { emoji: '🥖', name: 'Baguette' },
    { emoji: '🫓', name: 'Focaccia' },
  ],
  /* Livello 2 — Frutta e verdura */
  2: [
    { emoji: '🍎', name: 'Mela' },
    { emoji: '🥕', name: 'Carota' },
    { emoji: '🍌', name: 'Banana' },
    { emoji: '🥦', name: 'Broccoli' },
    { emoji: '🍊', name: 'Arancia' },
    { emoji: '🍅', name: 'Pomodoro' },
    { emoji: '🥬', name: 'Insalata' },
    { emoji: '🍇', name: 'Uva' },
  ],
  /* Livello 3 — Latte e derivati */
  3: [
    { emoji: '🥛', name: 'Latte' },
    { emoji: '🧀', name: 'Formaggio' },
    { emoji: '🍦', name: 'Yogurt' },
    { emoji: '🧈', name: 'Burro' },
    { emoji: '🫙', name: 'Panna' },
  ],
  /* Livello 4 — Carne, pesce, uova, legumi */
  4: [
    { emoji: '🍗', name: 'Pollo' },
    { emoji: '🐟', name: 'Pesce' },
    { emoji: '🥚', name: 'Uovo' },
    { emoji: '🫘', name: 'Legumi' },
    { emoji: '🥩', name: 'Carne' },
  ],
  /* Livello 5 — VERTICE: Grassi e dolci */
  5: [
    { emoji: '🍫', name: 'Cioccolato' },
    { emoji: '🍬', name: 'Caramella' },
    { emoji: '🍰', name: 'Torta' },
    { emoji: '🍟', name: 'Patatine' },
    { emoji: '🥤', name: 'Bibita' },
  ],
};

/* Quanti alimenti selezionare per livello in base alla difficoltà */
const LEVEL_PICK = {
  easy:   { 1: 3, 2: 3, 3: 1, 4: 2, 5: 1 },   // 10
  medium: { 1: 4, 2: 4, 3: 3, 4: 2, 5: 2 },     // 15
  hard:   { 1: 5, 2: 5, 3: 4, 4: 3, 5: 3 },     // 20
};

/* §2 ── STATO ────────────────────────────────────────────────── */
const state = {
  difficulty:    'medium',
  foods:         [],       // { emoji, name, level, id }
  placed:        0,
  errors:        0,
  seconds:       0,
  timerID:       null,
  levelCounts:   {},       // { level: { placed, total } }
  bgPlaying:     false,
  audioUnlocked: false,
  dragItem:      null,     // elemento DOM in drag
  ghostEl:       null,     // fantasma touch
};

/* §3 ── DOM REFS ─────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const $startScreen  = $('start-screen');
const $gameScreen   = $('game-screen');
const $winScreen    = $('win-screen');
const $timerVal     = $('timer-val');
const $correctVal   = $('correct-val');
const $correctTot   = $('correct-tot');
const $errorsVal    = $('errors-val');
const $hstatTimer   = $('hstat-timer');
const $btnStart     = $('btn-start');
const $btnHome      = $('btn-home');
const $btnRestart   = $('btn-restart');
const $btnMusic     = $('btn-music');
const $btnAgain     = $('btn-again');
const $btnHomeWin   = $('btn-home-win');
const $modalHome    = $('modal-home');
const $modalYes     = $('modal-yes');
const $modalNo      = $('modal-no');
const $modalDiff    = $('modal-diff');
const $modalDiffOk  = $('modal-diff-ok');
const $modalDiffCx  = $('modal-diff-cancel');
const $diffBtns2    = document.querySelectorAll('[data-diff2]');
const $resTime      = $('res-time');
const $resCorrect   = $('res-correct');
const $resScore     = $('res-score');
const $starsRow     = $('stars-row');
const $particles    = $('particles');
const $confetti     = $('confetti-container');
const $foodQueue    = $('food-queue');
const $toast        = $('toast');
const $diffBtns     = document.querySelectorAll('.diff-btn[data-diff]');
const pyrLevels     = document.querySelectorAll('.pyr-level');

/* §4 ── AUDIO ────────────────────────────────────────────────── */
const SND = {
  correct: $('snd-correct'),
  wrong:   $('snd-wrong'),
  level:   $('snd-level'),
  win:     $('snd-win'),
  bg:      $('snd-bg'),
};

function playSound(key, vol = 1) {
  if (!state.audioUnlocked) return;
  const el = SND[key];
  if (!el || el === SND.bg) return;
  try { el.volume = vol; el.currentTime = 0; el.play().catch(() => {}); } catch (_) {}
}

function unlockAudio() {
  if (state.audioUnlocked) return;
  state.audioUnlocked = true;
  // Sblocca solo gli effetti sonori (no bg music)
  Object.entries(SND).forEach(([key, el]) => {
    if (!el || key === 'bg') return;
    el.volume = 0;
    el.play().then(() => { el.pause(); el.volume = 1; el.currentTime = 0; }).catch(() => {});
  });
}

function startMusic() {
  if (state.bgPlaying || !SND.bg) return;
  SND.bg.volume = 0.4;
  SND.bg.play().then(() => {
    state.bgPlaying = true;
    $btnMusic.textContent = '🔊';
  }).catch(() => {});
}

function toggleMusic() {
  if (state.bgPlaying) {
    SND.bg?.pause();
    state.bgPlaying = false;
    $btnMusic.textContent = '🔇';
  } else {
    if (SND.bg) {
      SND.bg.volume = 0.4;
      SND.bg.play().then(() => {
        state.bgPlaying = true;
        $btnMusic.textContent = '🔊';
      }).catch(() => {});
    }
  }
}

/* §5 ── PARTICELLE ───────────────────────────────────────────── */
function buildParticles() {
  $particles.innerHTML = '';
  const emojis = ['🍎','🥕','🍞','🥛','🍗','🍫','🍌','🧀','🐟','🍇','🍝','🥦','🍊','🥚','🫘'];
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('span');
    el.className = 'particle';
    el.textContent = emojis[i % emojis.length];
    const dur   = 10 + Math.random() * 14;
    const delay = -(Math.random() * dur);
    const size  = 18 + Math.random() * 22;
    const op    = 0.10 + Math.random() * 0.12;
    el.style.cssText = `left:${Math.random()*100}%;font-size:${size}px;--dur:${dur}s;--delay:${delay}s;--op:${op.toFixed(2)}`;
    $particles.appendChild(el);
  }
}

/* §6 ── TIMER ────────────────────────────────────────────────── */
function startTimer() {
  clearInterval(state.timerID);
  state.seconds = 0;
  $timerVal.textContent = '00:00';
  $hstatTimer.classList.remove('urgent');
  state.timerID = setInterval(() => {
    state.seconds++;
    const m = String(Math.floor(state.seconds / 60)).padStart(2, '0');
    const s = String(state.seconds % 60).padStart(2, '0');
    $timerVal.textContent = `${m}:${s}`;
    if (state.seconds > 180) $hstatTimer.classList.add('urgent');
  }, 1000);
}

function stopTimer() { clearInterval(state.timerID); }

function fmtTime(sec) {
  return `${String(Math.floor(sec / 60)).padStart(2,'0')}:${String(sec % 60).padStart(2,'0')}`;
}

/* §7 ── SHUFFLE ──────────────────────────────────────────────── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* §8 ── COSTRUZIONE GIOCO ────────────────────────────────────── */
function buildGame() {
  const cfg  = DIFF[state.difficulty];
  const pick = LEVEL_PICK[state.difficulty];

  // Seleziona alimenti casuali da ogni livello
  state.foods = [];
  state.levelCounts = {};
  let id = 0;
  for (let lvl = 1; lvl <= 5; lvl++) {
    const pool = shuffle(PYRAMID_FOODS[lvl]);
    const count = Math.min(pick[lvl], pool.length);
    state.levelCounts[lvl] = { placed: 0, total: count };
    for (let i = 0; i < count; i++) {
      state.foods.push({ ...pool[i], level: lvl, id: id++ });
    }
  }

  state.placed = 0;
  state.errors = 0;

  // UI header
  $correctVal.textContent = '0';
  $correctTot.textContent = `/${cfg.foods}`;
  $errorsVal.textContent  = '0';
  $hstatTimer.classList.remove('urgent');

  // Reset piramide
  pyrLevels.forEach(lv => {
    lv.classList.remove('completed', 'drag-over');
    const slots = lv.querySelector('.pyr-slots');
    if (slots) slots.innerHTML = '';
  });

  // Costruisci coda alimenti (mescolati)
  $foodQueue.innerHTML = '';
  shuffle(state.foods).forEach((food, idx) => {
    $foodQueue.appendChild(createFoodItem(food, idx));
  });
}

function createFoodItem(food, idx) {
  const el = document.createElement('div');
  el.className = 'food-item';
  el.dataset.level = food.level;
  el.dataset.id    = food.id;
  el.setAttribute('role', 'listitem');
  el.setAttribute('aria-label', `${food.name} — trascinami`);
  el.setAttribute('draggable', 'true');
  el.style.setProperty('--d', `${idx * 0.06}s`);

  const emojiSpan = document.createElement('span');
  emojiSpan.className = 'food-emoji';
  emojiSpan.setAttribute('aria-hidden', 'true');
  emojiSpan.textContent = food.emoji;
  const nameSpan = document.createElement('span');
  nameSpan.className = 'food-name';
  nameSpan.textContent = food.name;
  el.appendChild(emojiSpan);
  el.appendChild(nameSpan);

  // Desktop drag
  el.addEventListener('dragstart', onDragStart);
  el.addEventListener('dragend',   onDragEnd);

  // Touch drag
  el.addEventListener('touchstart', onTouchStart, { passive: false });
  el.addEventListener('touchmove',  onTouchMove,  { passive: false });
  el.addEventListener('touchend',   onTouchEnd);

  return el;
}

/* §9 ── DRAG & DROP (Desktop) ────────────────────────────────── */
function onDragStart(e) {
  const item = e.target.closest('.food-item');
  if (!item) return;
  state.dragItem = item;
  item.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', item.dataset.id);
}

function onDragEnd(e) {
  const item = e.target.closest('.food-item');
  if (item) item.classList.remove('dragging');
  state.dragItem = null;
  pyrLevels.forEach(lv => lv.classList.remove('drag-over'));
}

// Drop sui livelli piramide
pyrLevels.forEach(lv => {
  lv.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    lv.classList.add('drag-over');
  });

  lv.addEventListener('dragleave', () => {
    lv.classList.remove('drag-over');
  });

  lv.addEventListener('drop', e => {
    e.preventDefault();
    lv.classList.remove('drag-over');
    const itemId = e.dataTransfer.getData('text/plain');
    const foodEl = $foodQueue.querySelector(`.food-item[data-id="${itemId}"]`);
    if (foodEl) handleDrop(foodEl, lv);
  });
});

/* §10 ── TOUCH DRAG (Mobile) ─────────────────────────────────── */
function onTouchStart(e) {
  const item = e.target.closest('.food-item');
  if (!item) return;
  e.preventDefault();

  state.dragItem = item;
  item.classList.add('dragging');

  // Crea ghost
  const ghost = document.createElement('div');
  ghost.className = 'food-ghost';
  const ghostEmoji = document.createElement('span');
  ghostEmoji.className = 'food-emoji';
  ghostEmoji.textContent = item.querySelector('.food-emoji').textContent;
  const ghostName = document.createElement('span');
  ghostName.className = 'food-name';
  ghostName.textContent = item.querySelector('.food-name').textContent;
  ghost.appendChild(ghostEmoji);
  ghost.appendChild(ghostName);
  document.body.appendChild(ghost);
  state.ghostEl = ghost;

  const touch = e.touches[0];
  positionGhost(ghost, touch.clientX, touch.clientY);
}

function onTouchMove(e) {
  if (!state.dragItem || !state.ghostEl) return;
  e.preventDefault();
  const touch = e.touches[0];
  positionGhost(state.ghostEl, touch.clientX, touch.clientY);

  // Evidenzia livello sotto il dito
  pyrLevels.forEach(lv => {
    const rect = lv.getBoundingClientRect();
    if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
        touch.clientY >= rect.top  && touch.clientY <= rect.bottom) {
      lv.classList.add('drag-over');
    } else {
      lv.classList.remove('drag-over');
    }
  });
}

function onTouchEnd(e) {
  if (!state.dragItem) return;
  const item = state.dragItem;

  // Rimuovi ghost
  if (state.ghostEl) {
    state.ghostEl.remove();
    state.ghostEl = null;
  }

  // Trova livello sotto l'ultimo tocco
  const touch = e.changedTouches[0];
  let hitLevel = null;
  pyrLevels.forEach(lv => {
    lv.classList.remove('drag-over');
    const rect = lv.getBoundingClientRect();
    if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
        touch.clientY >= rect.top  && touch.clientY <= rect.bottom) {
      hitLevel = lv;
    }
  });

  item.classList.remove('dragging');
  state.dragItem = null;

  if (hitLevel) {
    handleDrop(item, hitLevel);
  }
}

function positionGhost(ghost, x, y) {
  ghost.style.left = `${x - 40}px`;
  ghost.style.top  = `${y - 40}px`;
}

/* §11 ── LOGICA DI GIOCO ─────────────────────────────────────── */
function handleDrop(foodEl, levelEl) {
  const foodLevel   = parseInt(foodEl.dataset.level);
  const targetLevel = parseInt(levelEl.dataset.level);

  if (foodLevel === targetLevel) {
    onCorrect(foodEl, levelEl);
  } else {
    onWrong(foodEl, levelEl);
  }
}

function onCorrect(foodEl, levelEl) {
  playSound('correct', 0.7);

  const emoji = foodEl.querySelector('.food-emoji').textContent;
  const name  = foodEl.querySelector('.food-name').textContent;

  // Flash verde e rimuovi dalla coda
  foodEl.classList.add('correct');
  setTimeout(() => foodEl.remove(), 450);

  // Aggiungi alla piramide
  const slot = document.createElement('span');
  slot.className = 'slot-food';
  const slotEmoji = document.createElement('span');
  slotEmoji.className = 'slot-emoji';
  slotEmoji.textContent = emoji;
  slot.appendChild(slotEmoji);
  slot.appendChild(document.createTextNode(name));
  levelEl.querySelector('.pyr-slots').appendChild(slot);

  // Aggiorna contatori
  state.placed++;
  $correctVal.textContent = state.placed;
  bump($correctVal);

  const lvl = parseInt(levelEl.dataset.level);
  state.levelCounts[lvl].placed++;

  showToast(`${emoji} ${name} — Corretto!`, 'ok');

  // Controlla se il livello è completato
  if (state.levelCounts[lvl].placed === state.levelCounts[lvl].total) {
    onLevelComplete(levelEl, lvl);
  }

  // Controlla vittoria
  if (state.placed === state.foods.length) {
    setTimeout(onWin, 800);
  }
}

function onWrong(foodEl, levelEl) {
  playSound('wrong', 0.5);

  state.errors++;
  $errorsVal.textContent = state.errors;
  bump($errorsVal);

  foodEl.classList.add('wrong');
  setTimeout(() => foodEl.classList.remove('wrong'), 500);

  const name = foodEl.querySelector('.food-name').textContent;
  showToast(`❌ ${name} non va qui!`, 'err');
}

/* §12 ── COMPLETAMENTO LIVELLO ──────────────────────────────── */
function onLevelComplete(levelEl, lvl) {
  levelEl.classList.add('completed');
  playSound('level', 0.85);
  spawnBurst(levelEl);

  const labels = {
    1: '🏗️ Base completata!',
    2: '🥗 Frutta e verdura OK!',
    3: '🧀 Latticini posizionati!',
    4: '🍗 Proteine al posto giusto!',
    5: '🔺 Vertice completato!',
  };
  setTimeout(() => showToast(labels[lvl] || 'Livello completato!', 'level'), 300);
}

/* Particelle esplosive intorno al livello */
function spawnBurst(el) {
  const colors = ['#ffd600','#ff9800','#f44336','#4caf50','#2196f3','#e91e63'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'burst-particle';
    const angle = (i / 18) * 360;
    const dist  = 40 + Math.random() * 60;
    const bx = Math.cos(angle * Math.PI / 180) * dist;
    const by = Math.sin(angle * Math.PI / 180) * dist;
    p.style.cssText = `
      left:50%;top:50%;
      background:${colors[i % colors.length]};
      --bx:${bx}px;--by:${by}px;
      --bd:${0.5 + Math.random()*0.5}s;
    `;
    el.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }
}

/* §13 ── TOAST ────────────────────────────────────────────────── */
let toastTimer = null;
function showToast(msg, type) {
  clearTimeout(toastTimer);
  $toast.textContent = msg;
  $toast.className = 'toast show';
  if (type === 'ok')    $toast.classList.add('toast-ok');
  if (type === 'err')   $toast.classList.add('toast-err');
  if (type === 'level') $toast.classList.add('toast-level');
  toastTimer = setTimeout(() => {
    $toast.classList.remove('show');
  }, 1800);
}

/* §14 ── VITTORIA ────────────────────────────────────────────── */
function onWin() {
  stopTimer();
  playSound('win', 0.9);

  const cfg   = DIFF[state.difficulty];
  const stars = calcStars(state.errors, state.seconds, cfg);
  const score = calcScore(state.errors, state.seconds, cfg, stars);

  $resTime.textContent    = fmtTime(state.seconds);
  $resCorrect.textContent = state.placed;
  $resScore.textContent   = score;

  setTimeout(() => {
    showScreen('win-screen');
    revealStars(stars);
    spawnConfetti();
  }, 500);
}

function calcStars(errors, sec, cfg) {
  if (errors === 0 && sec < 90)  return 3;
  if (errors <= 2 && sec < 150)  return 2;
  return 1;
}

function calcScore(errors, sec, cfg, stars) {
  const base      = cfg.foods * 100;
  const errorPen  = errors * 50;
  const timeBonus = Math.max(0, (200 - sec) * 2);
  return Math.max(0, base - errorPen + timeBonus + stars * 80);
}

/* §15 ── STELLE ──────────────────────────────────────────────── */
function revealStars(count) {
  const items = $starsRow.querySelectorAll('.star-item');
  items.forEach((star, i) => {
    star.classList.remove('reveal', 'grey');
    void star.offsetWidth;
    if (i < count) {
      star.style.animationDelay = `${i * 230}ms`;
      setTimeout(() => star.classList.add('reveal'), i * 230);
    } else {
      setTimeout(() => { star.classList.add('reveal', 'grey'); }, i * 230);
    }
  });
}

/* §16 ── CONFETTI ────────────────────────────────────────────── */
function spawnConfetti() {
  $confetti.innerHTML = '';
  const colors = ['#ffd600','#ff9800','#f44336','#4caf50','#2196f3','#9c27b0','#00bcd4','#e91e63'];
  for (let i = 0; i < 110; i++) {
    const el = document.createElement('div');
    el.className = 'confetto';
    const size = 7 + Math.random() * 10;
    el.style.cssText = `
      left:${Math.random()*100}%;
      top:-${size}px;
      width:${size}px;
      height:${size}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      border-radius:${Math.random()>0.5?'50%':'3px'};
      --cd:${1.4+Math.random()*2.2}s;
      --cd-delay:${Math.random()*1.4}s;
    `;
    $confetti.appendChild(el);
  }
  setTimeout(() => { $confetti.innerHTML = ''; }, 5000);
}

/* §17 ── GESTIONE SCHERMATE ──────────────────────────────────── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* §18 ── BUMP ────────────────────────────────────────────────── */
function bump(el) {
  el.classList.remove('bump');
  void el.offsetWidth;
  el.classList.add('bump');
}

/* §19 ── AVVIO / RIAVVIO ─────────────────────────────────────── */
function startGame() {
  unlockAudio();
  showScreen('game-screen');
  buildGame();
  startTimer();
  startMusic();
}

function restartGame() {
  stopTimer();
  buildGame();
  startTimer();
}

/* §20 ── EVENT LISTENERS ─────────────────────────────────────── */

// Selezione difficoltà
$diffBtns.forEach(btn => btn.addEventListener('click', () => {
  $diffBtns.forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.difficulty = btn.dataset.diff;
}));

// Start
$btnStart.addEventListener('click', startGame);

// Home (dal gioco)
$btnHome.addEventListener('click', () => { $modalHome.hidden = false; });

// Riavvia
$btnRestart.addEventListener('click', restartGame);

// Musica
$btnMusic.addEventListener('click', () => { unlockAudio(); toggleMusic(); });

// Gioca ancora → apre modale difficoltà
$btnAgain.addEventListener('click', () => {
  $diffBtns2.forEach(b => {
    b.classList.toggle('selected', b.dataset.diff2 === state.difficulty);
  });
  $modalDiff.hidden = false;
});

// Modale difficoltà — selezione
$diffBtns2.forEach(btn => btn.addEventListener('click', () => {
  $diffBtns2.forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.difficulty = btn.dataset.diff2;
  $diffBtns.forEach(b => b.classList.toggle('selected', b.dataset.diff === state.difficulty));
}));

// Modale difficoltà — conferma
$modalDiffOk.addEventListener('click', () => {
  $modalDiff.hidden = true;
  showScreen('game-screen');
  restartGame();
});

// Modale difficoltà — annulla
$modalDiffCx.addEventListener('click', () => { $modalDiff.hidden = true; });
$modalDiff.addEventListener('click', e => { if (e.target === $modalDiff) $modalDiff.hidden = true; });

// Home dalla vittoria
$btnHomeWin.addEventListener('click', () => { window.location.href = '../../index.html'; });

// Modale home
$modalYes.addEventListener('click', () => { window.location.href = '../../index.html'; });
$modalNo .addEventListener('click', () => { $modalHome.hidden = true; });
$modalHome.addEventListener('click', e => { if (e.target === $modalHome) $modalHome.hidden = true; });

// ESC chiude modali
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!$modalHome.hidden) $modalHome.hidden = true;
    if (!$modalDiff.hidden) $modalDiff.hidden = true;
  }
});

// Blocca drag su qualsiasi elemento che non sia un .food-item
document.addEventListener('dragstart', e => {
  if (!e.target.closest('.food-item')) e.preventDefault();
});

/* §21 ── INIT ────────────────────────────────────────────────── */
buildParticles();
