'use strict';
/* ================================================================
   MEMORY DEGLI ALIMENTI — game.js
   ================================================================ */

/* §0 ── CONFIG ──────────────────────────────────────────────── */
const DIFF = {
  easy:   { pairs: 6,  cols: 3, colsMobile: 3, rows: 4, rowsMobile: 4, parMoves: 15, parTime: 70  },
  medium: { pairs: 8,  cols: 4, colsMobile: 4, rows: 4, rowsMobile: 4, parMoves: 22, parTime: 100 },
  hard:   { pairs: 12, cols: 6, colsMobile: 4, rows: 4, rowsMobile: 6, parMoves: 36, parTime: 160 },
};

/* §1 ── DATABASE ALIMENTI ───────────────────────────────────── */
const ALL_FOODS = [
  { id:  1, emoji: '🍎', name: 'Mela'      },
  { id:  2, emoji: '🍌', name: 'Banana'    },
  { id:  3, emoji: '🥕', name: 'Carota'    },
  { id:  4, emoji: '🥦', name: 'Broccoli'  },
  { id:  5, emoji: '🍇', name: 'Uva'       },
  { id:  6, emoji: '🍊', name: 'Arancia'   },
  { id:  7, emoji: '🍓', name: 'Fragola'   },
  { id:  8, emoji: '🥑', name: 'Avocado'   },
  { id:  9, emoji: '🌽', name: 'Mais'      },
  { id: 10, emoji: '🥝', name: 'Kiwi'      },
  { id: 11, emoji: '🍋', name: 'Limone'    },
  { id: 12, emoji: '🫐', name: 'Mirtilli'  },
  { id: 13, emoji: '🍅', name: 'Pomodoro'  },
  { id: 14, emoji: '🥜', name: 'Arachidi'  },
  { id: 15, emoji: '🧄', name: 'Aglio'     },
  { id: 16, emoji: '🫒', name: 'Olive'     },
];

/* §2 ── STATO ────────────────────────────────────────────────── */
const state = {
  difficulty:   'medium',
  cards:        [],
  flipped:      [],
  matchedCount: 0,
  totalPairs:   8,
  moves:        0,
  seconds:      0,
  timerID:      null,
  canFlip:      true,
  bgPlaying:    false,
  audioUnlocked: false,
};

/* §3 ── DOM REFS ─────────────────────────────────────────────── */
const $startScreen = document.getElementById('start-screen');
const $gameScreen  = document.getElementById('game-screen');
const $winScreen   = document.getElementById('win-screen');
const $gameGrid    = document.getElementById('game-grid');
const $timerVal    = document.getElementById('timer-val');
const $movesVal    = document.getElementById('moves-val');
const $pairsVal    = document.getElementById('pairs-val');
const $pairsTot    = document.getElementById('pairs-tot');
const $hstatTimer  = document.getElementById('hstat-timer');
const $btnStart    = document.getElementById('btn-start');
const $btnHome     = document.getElementById('btn-home');
const $btnRestart  = document.getElementById('btn-restart');
const $btnMusic    = document.getElementById('btn-music');
const $btnAgain    = document.getElementById('btn-again');
const $btnHomeWin  = document.getElementById('btn-home-win');
const $modalHome   = document.getElementById('modal-home');
const $modalYes    = document.getElementById('modal-yes');
const $modalNo     = document.getElementById('modal-no');
const $modalDiff   = document.getElementById('modal-diff');
const $modalDiffOk = document.getElementById('modal-diff-ok');
const $modalDiffCx = document.getElementById('modal-diff-cancel');
const $diffBtns2   = document.querySelectorAll('[data-diff2]');
const $resTime     = document.getElementById('res-time');
const $resMoves    = document.getElementById('res-moves');
const $resScore    = document.getElementById('res-score');
const $starsRow    = document.getElementById('stars-row');
const $particles   = document.getElementById('particles');
const $confetti    = document.getElementById('confetti-container');
const $diffBtns    = document.querySelectorAll('.diff-btn');

/* §4 ── AUDIO ────────────────────────────────────────────────── */
const SND = {
  flip:  document.getElementById('snd-flip'),
  match: document.getElementById('snd-match'),
  wrong: document.getElementById('snd-wrong'),
  win:   document.getElementById('snd-win'),
  bg:    document.getElementById('snd-bg'),
};

function playSound(key, vol = 1) {
  if (!state.audioUnlocked) return;
  const el = SND[key];
  if (!el) return;
  try { el.volume = vol; el.currentTime = 0; el.play().catch(() => {}); } catch (_) {}
}

function unlockAudio() {
  if (state.audioUnlocked) return;
  state.audioUnlocked = true;
  Object.values(SND).forEach(el => {
    if (!el) return;
    el.play().then(() => el.pause()).catch(() => {});
  });
}

function toggleMusic() {
  if (state.bgPlaying) {
    SND.bg?.pause();
    state.bgPlaying = false;
    $btnMusic.textContent = '🔇';
  } else {
    SND.bg && SND.bg.play().catch(() => {});
    state.bgPlaying = true;
    $btnMusic.textContent = '🔊';
  }
}

/* §5 ── PARTICELLE ───────────────────────────────────────────── */
function buildParticles() {
  $particles.innerHTML = '';
  const emojis = ALL_FOODS.map(f => f.emoji);
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
    if (state.seconds > 120) $hstatTimer.classList.add('urgent');
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

/* §8 ── BUILD GRIGLIA ────────────────────────────────────────── */
function buildGrid() {
  const cfg = DIFF[state.difficulty];

  // Seleziona e duplica alimenti
  const foods = shuffle(ALL_FOODS).slice(0, cfg.pairs);
  state.cards = shuffle(foods.flatMap(f => [
    { ...f, uid: `${f.id}-a` },
    { ...f, uid: `${f.id}-b` },
  ]));

  state.totalPairs   = cfg.pairs;
  state.matchedCount = 0;
  state.moves        = 0;
  state.flipped      = [];
  state.canFlip      = true;

  // Colonne e righe CSS
  const isMobile = window.innerWidth <= 600;
  const cols = isMobile ? cfg.colsMobile : cfg.cols;
  const rows = isMobile ? cfg.rowsMobile : cfg.rows;
  $gameGrid.className = `game-grid cols-${cols}`;
  $gameGrid.style.setProperty('--rows', rows);

  // Aggiorna UI header
  $movesVal.textContent = '0';
  $pairsVal.textContent = '0';
  $pairsTot.textContent = `/${cfg.pairs}`;
  $hstatTimer.classList.remove('urgent');

  // Costruisci carte
  $gameGrid.innerHTML = '';
  state.cards.forEach((food, idx) => {
    $gameGrid.appendChild(createCard(food, idx));
  });
}

function createCard(food, idx) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id  = food.id;
  card.dataset.uid = food.uid;
  card.setAttribute('role', 'gridcell');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Carta coperta`);

  const inner = document.createElement('div');
  inner.className = 'card-inner';
  const back = document.createElement('div');
  back.className = 'card-back';
  back.setAttribute('aria-hidden', 'true');
  const shimmer = document.createElement('div');
  shimmer.className = 'card-shimmer';
  back.appendChild(shimmer);
  const front = document.createElement('div');
  front.className = 'card-front';
  front.setAttribute('aria-hidden', 'true');
  const cardEmoji = document.createElement('span');
  cardEmoji.className = 'card-emoji';
  cardEmoji.textContent = food.emoji;
  const cardName = document.createElement('span');
  cardName.className = 'card-name';
  cardName.textContent = food.name;
  front.appendChild(cardEmoji);
  front.appendChild(cardName);
  inner.appendChild(back);
  inner.appendChild(front);
  card.appendChild(inner);

  // Entrata a cascata
  card.style.animation = `cardEntrance 0.45s ${idx * 0.045}s var(--ease-bounce) both`;

  card.addEventListener('click', () => onCardClick(card));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onCardClick(card); }
  });
  return card;
}

/* §9 ── LOGICA DI GIOCO ──────────────────────────────────────── */
function onCardClick(card) {
  if (!state.canFlip)                                          return;
  if (card.classList.contains('flipped'))                      return;
  if (card.classList.contains('matched'))                      return;
  if (state.flipped.length >= 2)                               return;

  unlockAudio();
  card.classList.add('flipped');
  card.setAttribute('aria-label', `${card.querySelector('.card-name').textContent} — scoperta`);
  playSound('flip', 0.35);

  state.flipped.push(card);

  if (state.flipped.length === 2) {
    state.moves++;
    $movesVal.textContent = state.moves;
    bump($movesVal);
    checkMatch();
  }
}

function checkMatch() {
  const [a, b] = state.flipped;
  state.canFlip = false;

  if (a.dataset.id === b.dataset.id) {
    // ─── COPPIA TROVATA ───
    setTimeout(() => {
      a.classList.replace('flipped', 'matched');
      b.classList.replace('flipped', 'matched');
      a.setAttribute('aria-label', `${a.querySelector('.card-name').textContent} — abbinata`);
      b.setAttribute('aria-label', `${b.querySelector('.card-name').textContent} — abbinata`);
      playSound('match', 0.75);

      state.matchedCount++;
      $pairsVal.textContent = state.matchedCount;
      bump($pairsVal);

      state.flipped  = [];
      state.canFlip  = true;

      if (state.matchedCount === state.totalPairs) onWin();
    }, 380);

  } else {
    // ─── ERRORE ───
    setTimeout(() => {
      a.classList.add('wrong');
      b.classList.add('wrong');
      playSound('wrong', 0.45);

      setTimeout(() => {
        a.classList.remove('flipped', 'wrong');
        b.classList.remove('flipped', 'wrong');
        a.setAttribute('aria-label', 'Carta coperta');
        b.setAttribute('aria-label', 'Carta coperta');
        state.flipped = [];
        state.canFlip = true;
      }, 580);
    }, 480);
  }
}

function bump(el) {
  el.classList.remove('bump');
  void el.offsetWidth; // reflow
  el.classList.add('bump');
}

/* §10 ── VITTORIA ────────────────────────────────────────────── */
function onWin() {
  stopTimer();
  playSound('win', 0.9);

  const cfg   = DIFF[state.difficulty];
  const stars = calcStars(state.moves, state.seconds, cfg);
  const score = calcScore(state.moves, state.seconds, cfg, stars);

  $resTime.textContent  = fmtTime(state.seconds);
  $resMoves.textContent = state.moves;
  $resScore.textContent = score;

  setTimeout(() => {
    showScreen('win-screen');
    revealStars(stars);
    spawnConfetti();
  }, 650);
}

function calcStars(moves, sec, cfg) {
  const mr = moves / cfg.parMoves;
  const tr = sec   / cfg.parTime;
  if (mr <= 1.0 && tr <= 1.1) return 3;
  if (mr <= 1.5 || tr <= 1.7) return 2;
  return 1;
}

function calcScore(moves, sec, cfg, stars) {
  const base      = cfg.pairs * 100;
  const moveBonus = Math.max(0, (cfg.parMoves - moves) * 12);
  const timeBonus = Math.max(0, (cfg.parTime  - sec)   * 2);
  return base + moveBonus + timeBonus + stars * 60;
}

/* §11 ── STELLE ──────────────────────────────────────────────── */
function revealStars(count) {
  const items = $starsRow.querySelectorAll('.star-item');
  items.forEach((star, i) => {
    star.classList.remove('reveal', 'grey');
    void star.offsetWidth;
    if (i < count) {
      star.style.animationDelay = `${i * 230}ms`;
      setTimeout(() => star.classList.add('reveal'), i * 230);
    } else {
      setTimeout(() => star.classList.add('grey'), i * 230);
    }
  });
}

/* §12 ── CONFETTI ────────────────────────────────────────────── */
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

/* §13 ── GESTIONE SCHERMATE ──────────────────────────────────── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* §14 ── AVVIO / RIAVVIO ─────────────────────────────────────── */
function startGame() {
  showScreen('game-screen');
  buildGrid();
  startTimer();
  if (state.bgPlaying) SND.bg?.play().catch(() => {});
}

function restartGame() {
  stopTimer();
  state.flipped  = [];
  state.canFlip  = true;
  buildGrid();
  startTimer();
}

/* §15 ── EVENT LISTENERS ─────────────────────────────────────── */

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
  // Sincronizza i pulsanti del modale con la difficoltà attuale
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
  // Sincronizza anche i pulsanti della start screen
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

// Modale
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

// Aggiorna colonne/righe al resize
window.addEventListener('resize', () => {
  if ($gameScreen.classList.contains('active')) {
    const cfg  = DIFF[state.difficulty];
    const mob  = window.innerWidth <= 600;
    $gameGrid.className = `game-grid cols-${mob ? cfg.colsMobile : cfg.cols}`;
    $gameGrid.style.setProperty('--rows', mob ? cfg.rowsMobile : cfg.rows);
  }
});

/* §16 ── INIT ────────────────────────────────────────────────── */
buildParticles();
