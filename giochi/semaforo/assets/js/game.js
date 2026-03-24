/* ============================================================
   IL SEMAFORO DELLA MERENDA — game.js
   Struttura: Costanti → Audio → Glow → Settings → Calibrazione →
              About → Dati gioco → Logica → Sortable →
              Ghost touch/mouse → Keyboard shortcuts → Init
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     COSTANTI
     ===================================================== */
  const IMG_W        = 1456;
  const IMG_H        = 816;
  const BULB_D       = 110;
  const TOTAL        = 15;
  const MAX_ERRORS   = 3;

  const DEFAULT_COORDS = [
    { id: 'glow-red',    x: 230, y: 206 },
    { id: 'glow-yellow', x: 231, y: 319 },
    { id: 'glow-green',  x: 231, y: 427 },
  ];

  const CONFETTI_COLORS = [
    '#ff6f00', '#ffd600', '#43a047', '#2196f3',
    '#e91e63', '#9c27b0', '#00bcd4', '#ff5722'
  ];

  const correctZone = {
    patatine:  'zone-rosso',  cioccolato: 'zone-rosso',  brioche:  'zone-rosso',
    bibita:    'zone-rosso',  caramella:  'zone-rosso',
    torta:     'zone-giallo', succo:      'zone-giallo',  focaccia: 'zone-giallo',
    panino:    'zone-giallo', biscotto:   'zone-giallo',
    mela:      'zone-verde',  yogurt:     'zone-verde',   banana:   'zone-verde',
    carota:    'zone-verde',  pane:       'zone-verde',
  };

  const itemsData = [
    { id: 'patatine',   emoji: '🍟', label: 'Patatine' },
    { id: 'cioccolato', emoji: '🍫', label: 'Cioccolato' },
    { id: 'brioche',    emoji: '🥐', label: 'Brioche' },
    { id: 'bibita',     emoji: '🥤', label: 'Bibita' },
    { id: 'caramella',  emoji: '🍬', label: 'Caramella' },
    { id: 'torta',      emoji: '🍰', label: 'Torta fatta in casa' },
    { id: 'succo',      emoji: '🧃', label: 'Succo di frutta bio' },
    { id: 'focaccia',   emoji: '🫓', label: 'Focaccia' },
    { id: 'panino',     emoji: '🥪', label: 'Panino' },
    { id: 'biscotto',   emoji: '🍪', label: 'Biscotto fatto in casa' },
    { id: 'mela',       emoji: '🍎', label: 'Mela' },
    { id: 'yogurt',     emoji: '🥣', label: 'Yogurt' },
    { id: 'banana',     emoji: '🍌', label: 'Banana' },
    { id: 'carota',     emoji: '🥕', label: 'Carota' },
    { id: 'pane',       emoji: '🥖', label: 'Pane' },
  ];


  /* =====================================================
     STATO GIOCO
     ===================================================== */
  let correctCount  = 0;
  let errorCount    = 0;
  let bgPlaying     = false;
  let audioUnlocked = false;
  let trafficTimer  = null;
  let toastTimer    = null;


  /* =====================================================
     CACHE ELEMENTI DOM
     ===================================================== */
  const audioBg        = document.getElementById('audio-bg');
  const startZone      = document.getElementById('start-zone');
  const successScreen  = document.getElementById('success-screen');
  const gameoverScreen = document.getElementById('gameover-screen');
  const settingsPanel  = document.getElementById('settings-panel');
  const aboutPanel     = document.getElementById('about-panel');
  const calibOverlay   = document.getElementById('calib-overlay');
  const btnBgD         = document.getElementById('btn-bg-toggle');
  const btnBgM         = document.getElementById('btn-bg-toggle-mobile');
  const volumeSlider   = document.getElementById('volume-slider');


  /* =====================================================
     AUDIO
     ===================================================== */
  function getVolume() {
    return parseFloat(volumeSlider.value) || 0.4;
  }

  function playSound(id) {
    const audio = document.getElementById(id);
    if (!audio) return;
    audio.volume    = id === 'audio-rosso' ? 1.0 : getVolume();
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  function setBgButtons(playing) {
    const icon = playing ? '🎵' : '🔇';
    if (btnBgD) { btnBgD.textContent = icon; btnBgD.classList.toggle('on', playing); }
    if (btnBgM) { btnBgM.textContent = icon; btnBgM.classList.toggle('on', playing); }
  }

  function toggleBgMusic() {
    if (!audioBg.paused) {
      audioBg.pause();
      bgPlaying = false;
    } else {
      audioBg.muted  = false;
      audioBg.volume = getVolume();
      audioBg.play().catch(() => {});
      bgPlaying = true;
    }
    setBgButtons(bgPlaying);
  }

  function startBgMusic() {
    audioBg.muted  = false;
    audioBg.volume = getVolume();
    audioBg.play().catch(() => {});
    bgPlaying     = true;
    audioUnlocked = true;
    setBgButtons(true);
  }

  function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;

    ['audio-verde', 'audio-rosso', 'audio-vittoria'].forEach(id => {
      const a = document.getElementById(id);
      if (!a) return;
      a.play().then(() => { a.pause(); a.currentTime = 0; }).catch(() => {});
    });

    startBgMusic();
  }

  // Sblocca audio al primo gesto utente
  ['click', 'touchstart', 'keydown', 'pointerdown'].forEach(evt =>
    document.addEventListener(evt, unlockAudio, { once: true, passive: true })
  );

  btnBgD?.addEventListener('click', toggleBgMusic);
  btnBgM?.addEventListener('click', toggleBgMusic);

  volumeSlider.addEventListener('input', () => {
    if (!audioBg.paused) audioBg.volume = getVolume();
  });


  /* =====================================================
     GLOW SEMAFORO — posizionamento dinamico
     ===================================================== */
  let bulbCoords = (() => {
    try {
      const s = localStorage.getItem('semaforo_bulbCoords');
      if (!s) return JSON.parse(JSON.stringify(DEFAULT_COORDS));
      const parsed = JSON.parse(s);
      // Validazione schema: deve essere un array di 3 oggetti con id, x, y numerici
      if (!Array.isArray(parsed) || parsed.length !== 3) throw new Error('invalid');
      parsed.forEach(b => {
        if (typeof b.id !== 'string' || !Number.isFinite(b.x) || !Number.isFinite(b.y)) throw new Error('invalid');
      });
      return parsed;
    } catch (e) {
      localStorage.removeItem('semaforo_bulbCoords');
      return JSON.parse(JSON.stringify(DEFAULT_COORDS));
    }
  })();

  function saveCoords() {
    localStorage.setItem('semaforo_bulbCoords', JSON.stringify(bulbCoords));
  }

  function positionGlows() {
    const vw     = window.innerWidth;
    const vh     = window.innerHeight;
    const scale  = Math.max(vw / IMG_W, vh / IMG_H);
    const offsetX = (vw - IMG_W * scale) / 2;
    const d      = BULB_D * scale;

    bulbCoords.forEach(b => {
      const el = document.getElementById(b.id);
      if (!el) return;
      el.style.left   = (offsetX + b.x * scale - d / 2) + 'px';
      el.style.top    = (b.y * scale - d / 2) + 'px';
      el.style.width  = d + 'px';
      el.style.height = d + 'px';
    });
  }

  positionGlows();
  let _resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(positionGlows, 150);
  });


  /* =====================================================
     PANNELLO SETTINGS (Ctrl+Shift+8 / Cmd+8)
     ===================================================== */
  function openSettings() {
    document.getElementById('inp-red-x').value    = bulbCoords[0].x;
    document.getElementById('inp-red-y').value    = bulbCoords[0].y;
    document.getElementById('inp-yellow-x').value = bulbCoords[1].x;
    document.getElementById('inp-yellow-y').value = bulbCoords[1].y;
    document.getElementById('inp-green-x').value  = bulbCoords[2].x;
    document.getElementById('inp-green-y').value  = bulbCoords[2].y;
    settingsPanel.classList.add('show');
    settingsPanel.removeAttribute('aria-hidden');
  }

  function closeSettings() {
    settingsPanel.classList.remove('show');
    settingsPanel.setAttribute('aria-hidden', 'true');
  }

  document.getElementById('btn-settings-save').addEventListener('click', () => {
    const get = id => parseInt(document.getElementById(id).value);
    bulbCoords[0].x = get('inp-red-x')    || bulbCoords[0].x;
    bulbCoords[0].y = get('inp-red-y')    || bulbCoords[0].y;
    bulbCoords[1].x = get('inp-yellow-x') || bulbCoords[1].x;
    bulbCoords[1].y = get('inp-yellow-y') || bulbCoords[1].y;
    bulbCoords[2].x = get('inp-green-x')  || bulbCoords[2].x;
    bulbCoords[2].y = get('inp-green-y')  || bulbCoords[2].y;
    saveCoords();
    positionGlows();
    closeSettings();
  });

  document.getElementById('btn-settings-reset').addEventListener('click', () => {
    bulbCoords = JSON.parse(JSON.stringify(DEFAULT_COORDS));
    localStorage.removeItem('semaforo_bulbCoords');
    positionGlows();
    openSettings();
  });

  document.getElementById('btn-settings-close').addEventListener('click', closeSettings);


  /* =====================================================
     CALIBRAZIONE (Ctrl+Shift+9 / Cmd+9)
     ===================================================== */
  const calibSteps = [
    { label: '🔴 Clicca sul CENTRO del bulbo ROSSO',   color: '#ef5350' },
    { label: '🟡 Clicca sul CENTRO del bulbo GIALLO',  color: '#ffd600' },
    { label: '🟢 Clicca sul CENTRO del bulbo VERDE',   color: '#66bb6a' },
  ];

  let calibStep    = 0;
  let isCalibrating = false;

  function showCalibStep() {
    if (calibStep >= 3) {
      saveCoords();
      calibOverlay.textContent = '';
      const doneDiv = document.createElement('div');
      doneDiv.className = 'step';
      doneDiv.textContent = '✅ Calibrazione salvata!';
      calibOverlay.appendChild(doneDiv);
      calibOverlay.classList.add('show');
      document.body.classList.remove('calibrating');
      isCalibrating = false;
      positionGlows();
      setTimeout(() => calibOverlay.classList.remove('show'), 3000);
      return;
    }
    const s = calibSteps[calibStep];
    calibOverlay.textContent = '';
    const stepDiv = document.createElement('div');
    stepDiv.className = 'step';
    stepDiv.style.color = s.color;
    stepDiv.textContent = s.label;
    const instrDiv = document.createElement('div');
    instrDiv.textContent = 'Clicca esattamente al centro della luce';
    const hintDiv = document.createElement('div');
    hintDiv.className = 'hint';
    hintDiv.textContent = `Step ${calibStep + 1} / 3 \u00A0|\u00A0 ESC per annullare`;
    calibOverlay.appendChild(stepDiv);
    calibOverlay.appendChild(instrDiv);
    calibOverlay.appendChild(hintDiv);
    calibOverlay.classList.add('show');
  }

  function startCalib() {
    isCalibrating = true;
    calibStep     = 0;
    document.body.classList.add('calibrating');
    showCalibStep();
  }

  function stopCalib() {
    isCalibrating = false;
    document.body.classList.remove('calibrating');
    calibOverlay.classList.remove('show');
  }

  document.body.addEventListener('click', e => {
    if (!isCalibrating) return;
    const vw      = window.innerWidth;
    const scale   = Math.max(vw / IMG_W, window.innerHeight / IMG_H);
    const offsetX = (vw - IMG_W * scale) / 2;

    bulbCoords[calibStep].x = Math.round((e.clientX - offsetX) / scale);
    bulbCoords[calibStep].y = Math.round(e.clientY / scale);

    // Feedback visivo al click
    const f = document.createElement('div');
    f.style.cssText = `
      position:fixed; left:${e.clientX - 18}px; top:${e.clientY - 18}px;
      width:36px; height:36px; border-radius:50%;
      border:3px solid white; background:rgba(255,255,255,0.5);
      pointer-events:none; z-index:9998; transition:all 0.5s;`;
    document.body.appendChild(f);
    setTimeout(() => { f.style.transform = 'scale(2.5)'; f.style.opacity = '0'; }, 10);
    setTimeout(() => f.remove(), 520);

    calibStep++;
    showCalibStep();
  });


  /* =====================================================
     PANNELLO ABOUT
     ===================================================== */
  function openAbout(e) {
    e.stopPropagation();
    aboutPanel.classList.add('show');
    aboutPanel.removeAttribute('aria-hidden');
  }

  function closeAbout() {
    aboutPanel.classList.remove('show');
    aboutPanel.setAttribute('aria-hidden', 'true');
  }

  document.getElementById('btn-about').addEventListener('click', openAbout);
  document.getElementById('btn-about-mobile').addEventListener('click', openAbout);
  document.getElementById('btn-about-close').addEventListener('click', closeAbout);


  /* =====================================================
     KEYBOARD SHORTCUTS
     ===================================================== */
  document.addEventListener('keydown', e => {
    if (document.getElementById('start-screen')) return;
    if (e.key === 'Escape') {
      if (isCalibrating) { stopCalib(); return; }
      confirmHomeScreen.classList.remove('show');
      closeSettings();
      closeAbout();
      return;
    }

    const isMac        = navigator.platform.toUpperCase().includes('MAC');
    const comboSettings = isMac
      ? (e.metaKey && !e.shiftKey && e.key === '8')
      : (e.ctrlKey && e.shiftKey && (e.key === '8' || e.code === 'Digit8'));
    const comboCalib   = isMac
      ? (e.metaKey && !e.shiftKey && e.key === '9')
      : (e.ctrlKey && e.shiftKey && (e.key === '9' || e.code === 'Digit9'));

    if (comboSettings) {
      e.preventDefault();
      settingsPanel.classList.contains('show') ? closeSettings() : openSettings();
    }

    if (comboCalib) {
      e.preventDefault();
      isCalibrating ? stopCalib() : startCalib();
    }
  });


  /* =====================================================
     CONFETTI
     ===================================================== */
  function launchConfetti() {
    for (let i = 0; i < 120; i++) {
      setTimeout(() => {
        const c    = document.createElement('div');
        c.className = 'confetti-piece';
        const size = 8 + Math.random() * 14;
        c.style.cssText = `
          left: ${Math.random() * 100}vw; top: -20px;
          width: ${size}px; height: ${size}px;
          background: ${CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]};
          border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
          animation-duration: ${2 + Math.random() * 3}s; animation-delay: 0s;`;
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 5500);
      }, i * 40);
    }
  }


  /* =====================================================
     TOAST BANNER (solo mobile)
     ===================================================== */
  function showToast(type) {
    const banner = document.getElementById('toast-banner');
    const icon   = document.getElementById('toast-icon');
    const text   = document.getElementById('toast-text');
    const imgEl  = document.getElementById('toast-semaforo');

    clearTimeout(toastTimer);
    banner.classList.remove('show', 'green', 'red');
    imgEl.src = '';

    if (type === 'ok') {
      banner.classList.add('green');
      icon.textContent = '';
      text.textContent = 'Corretto!';
      imgEl.src = document.getElementById('img-semaforo-verde').src;
    } else {
      banner.classList.add('red');
      icon.textContent = '';
      text.textContent = 'Sbagliato!';
      imgEl.src = document.getElementById('img-semaforo-rosso').src;
    }

    void banner.offsetWidth; // forza reflow per riavviare animazione CSS
    banner.classList.add('show');
    toastTimer = setTimeout(() => banner.classList.remove('show'), 2200);
  }


  /* =====================================================
     SEMAFORO — feedback visivo e testuale
     ===================================================== */
  function setTraffic(status) {
    const red   = document.getElementById('glow-red');
    const green = document.getElementById('glow-green');
    const text  = document.getElementById('global-status');

    red.classList.remove('on');
    green.classList.remove('on');
    clearTimeout(trafficTimer);

    if (status === 'ok') {
      green.classList.add('on');
      playSound('audio-verde');
      text.textContent = '';
      text.appendChild(document.createTextNode('✅ '));
      const okStrong = document.createElement('strong');
      okStrong.style.color = '#1b5e20';
      okStrong.textContent = 'Perfetto! Alimento nel posto giusto!';
      text.appendChild(okStrong);
      text.appendChild(document.createTextNode(' 🎉'));
      trafficTimer = setTimeout(() => {
        green.classList.remove('on');
        text.textContent = 'Trascina gli alimenti nel rettangolo corretto! 🎮';
      }, 2500);
      if (window.innerWidth <= 768) showToast('ok');

    } else if (status === 'ko') {
      red.classList.add('on');
      playSound('audio-rosso');
      text.textContent = '';
      text.appendChild(document.createTextNode('❌ '));
      const koStrong = document.createElement('strong');
      koStrong.style.color = '#b71c1c';
      koStrong.textContent = 'Ops! Posto sbagliato, riprova!';
      text.appendChild(koStrong);
      trafficTimer = setTimeout(() => {
        red.classList.remove('on');
        text.textContent = 'Trascina gli alimenti nel rettangolo corretto! 🎮';
      }, 2500);
      if (window.innerWidth <= 768) showToast('ko');

    } else {
      text.textContent = 'Trascina gli alimenti nel rettangolo corretto! 🎮';
    }
  }


  /* =====================================================
     INDICATORE ERRORI
     ===================================================== */
  function updateErrorDots() {
    for (let i = 1; i <= 3; i++) {
      const dot    = document.getElementById(`err-dot-${i}`);
      const dotMob = document.getElementById(`err-dot-mob-${i}`);
      if (dot)    dot.classList.toggle('active', i <= errorCount);
      if (dotMob) dotMob.classList.toggle('active', i <= errorCount);
    }
  }


  /* =====================================================
     GAME OVER
     ===================================================== */
  function triggerGameOver() {
    playSound('audio-gameover');
    audioBg.pause();
    bgPlaying = false;
    setBgButtons(false);
    setTimeout(() => gameoverScreen.classList.add('show'), 600);
  }


  /* =====================================================
     SUCCESSO
     ===================================================== */
  function checkSuccess() {
    if (correctCount < TOTAL) return;

    playSound('audio-vittoria');
    audioBg.pause();
    bgPlaying = false;
    setBgButtons(false);

    setTimeout(() => {
      document.getElementById('success-score').textContent = `${TOTAL} / ${TOTAL} ✅`;
      successScreen.classList.add('show');
      launchConfetti();

      let blinks = 0;
      const g    = document.getElementById('glow-green');
      const blink = setInterval(() => {
        g.classList.toggle('on');
        blinks++;
        if (blinks >= 8) { clearInterval(blink); g.classList.remove('on'); }
      }, 300);
    }, 600);
  }


  /* =====================================================
     STATO ITEM
     ===================================================== */
  function updateItemStatus(el, correct) {
    el.classList.remove('correct', 'wrong');
    const check = el.querySelector('.check');
    if (correct === true)       { el.classList.add('correct'); check.textContent = '✅'; }
    else if (correct === false) { el.classList.add('wrong');   check.textContent = '❌'; }
    else                        { check.textContent = ''; }
  }


  /* =====================================================
     DRAG & DROP — handleDrop
     ===================================================== */
  function handleDrop(evt) {
    const itemEl     = evt.item;
    const id         = itemEl.dataset.id;
    const targetZoneId = evt.to.id;
    if (!correctZone[id]) return;

    if (correctZone[id] === targetZoneId) {
      // Risposta corretta
      updateItemStatus(itemEl, true);
      setTraffic('ok');
      correctCount++;
      checkSuccess();

    } else if (targetZoneId === 'start-zone') {
      // Rimesso nella zona di partenza → reset stato
      if (itemEl.classList.contains('correct')) correctCount = Math.max(0, correctCount - 1);
      updateItemStatus(itemEl, null);
      setTraffic(null);

    } else {
      // Risposta sbagliata
      updateItemStatus(itemEl, false);
      setTraffic('ko');
      errorCount++;
      updateErrorDots();
      startZone.appendChild(itemEl);
      if (errorCount >= MAX_ERRORS) triggerGameOver();
    }
  }


  /* =====================================================
     BUILD / RESET GIOCO
     ===================================================== */
  function createItem(item) {
    const div = document.createElement('div');
    div.className   = 'item';
    div.dataset.id  = item.id;
    div.setAttribute('role', 'listitem');
    const emojiSpan = document.createElement('span');
    emojiSpan.setAttribute('aria-hidden', 'true');
    emojiSpan.textContent = item.emoji;
    const labelSpan = document.createElement('span');
    labelSpan.className = 'label';
    labelSpan.textContent = item.label;
    const checkSpan = document.createElement('span');
    checkSpan.className = 'check';
    checkSpan.setAttribute('aria-hidden', 'true');
    div.appendChild(emojiSpan);
    div.appendChild(labelSpan);
    div.appendChild(checkSpan);
    return div;
  }

  function buildItems() {
    startZone.innerHTML = '';
    [...itemsData].sort(() => Math.random() - 0.5).forEach(item => startZone.appendChild(createItem(item)));
  }

  function resetGame() {
    correctCount = 0;
    errorCount   = 0;
    updateErrorDots();
    gameoverScreen.classList.remove('show');

    ['zone-rosso', 'zone-giallo', 'zone-verde'].forEach(id => {
      document.getElementById(id).querySelectorAll('.item').forEach(el => el.remove());
    });

    buildItems();
    setTraffic(null);
  }


  /* =====================================================
     SORTABLE — drag & drop tra zone
     ===================================================== */
  ['start-zone', 'zone-rosso', 'zone-giallo', 'zone-verde'].forEach(id => {
    Sortable.create(document.getElementById(id), {
      group:               'alimenti',
      animation:           220,
      draggable:           '.item',
      filter:              '.zone-icon-fixed',
      forceFallback:       true,
      fallbackClass:       '',
      fallbackOnBody:      true,
      fallbackTolerance:   0,
      delay:               0,
      delayOnTouchOnly:    false,
      touchStartThreshold: 1,
      onAdd:    handleDrop,
      onUpdate: handleDrop,
    });
  });

  // Blocca drag nativo del browser (Safari/macOS)
  document.addEventListener('dragstart', e => {
    if (e.target.closest('.item')) e.preventDefault();
  });

  // Effetto drag-over visivo sulle dropzone
  document.querySelectorAll('.dropzone').forEach(zone => {
    zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop',      () => zone.classList.remove('drag-over'));
  });


  /* =====================================================
     GHOST MANUALE (touch + mouse)
     ===================================================== */
  let touchGhost = null;
  let ghostOffX  = 0;
  let ghostOffY  = 0;

  function createGhost(item, clientX, clientY) {
    if (touchGhost) { touchGhost.remove(); touchGhost = null; }
    const rect = item.getBoundingClientRect();
    ghostOffX  = clientX - rect.left;
    ghostOffY  = clientY - rect.top;
    touchGhost = item.cloneNode(true);
    touchGhost.className  = 'touch-ghost';
    touchGhost.style.left = (clientX - ghostOffX) + 'px';
    touchGhost.style.top  = (clientY - ghostOffY) + 'px';
    document.body.appendChild(touchGhost);
  }

  function moveGhost(clientX, clientY) {
    if (!touchGhost) return;
    touchGhost.style.left = (clientX - ghostOffX) + 'px';
    touchGhost.style.top  = (clientY - ghostOffY) + 'px';
  }

  function removeGhost() {
    if (touchGhost) { touchGhost.remove(); touchGhost = null; }
  }

  // Touch
  document.addEventListener('touchstart', e => {
    const item = e.target.closest('.item');
    if (!item) return;
    const t = e.touches[0];
    createGhost(item, t.clientX, t.clientY);
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (touchGhost) e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchmove', e => {
    const t = e.touches[0];
    moveGhost(t.clientX, t.clientY);
  }, { passive: true });

  document.addEventListener('touchend',    removeGhost);
  document.addEventListener('touchcancel', removeGhost);

  // Mouse
  document.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    const item = e.target.closest('.item');
    if (!item) return;
    createGhost(item, e.clientX, e.clientY);
  });

  document.addEventListener('mousemove', e => {
    if (!touchGhost) return;
    if (e.buttons === 0) { removeGhost(); return; }
    moveGhost(e.clientX, e.clientY);
  });

  window.addEventListener('mouseup',    removeGhost);
  window.addEventListener('mouseleave', removeGhost);


  /* =====================================================
     SCHERMATA INIZIALE
     ===================================================== */
  document.getElementById('btn-start').addEventListener('click', function () {
    this.disabled = true;
    const screen = document.getElementById('start-screen');

    // Avvia musica (siamo dentro un click → browser lo permette)
    startBgMusic();

    // Sblocca SFX
    ['audio-verde', 'audio-rosso', 'audio-vittoria'].forEach(id => {
      const a = document.getElementById(id);
      if (!a) return;
      a.play().then(() => { a.pause(); a.currentTime = 0; }).catch(() => {});
    });

    screen.classList.add('hide');
    setTimeout(() => screen.remove(), 650);
  });


  /* =====================================================
     PULSANTI RESET / RETRY / PLAY AGAIN / CONFERMA HOME
     ===================================================== */
  document.getElementById('btn-reset').addEventListener('click',        e => { e.stopPropagation(); resetGame(); });
  document.getElementById('btn-reset-mobile').addEventListener('click', e => { e.stopPropagation(); resetGame(); });

  document.getElementById('btn-play-again').addEventListener('click', () => {
    successScreen.classList.remove('show');
    document.querySelectorAll('.confetti-piece').forEach(c => c.remove());
    resetGame();
  });

  document.getElementById('btn-retry').addEventListener('click', () => {
    gameoverScreen.classList.remove('show');
    resetGame();
  });
  const confirmHomeScreen = document.getElementById('confirm-home-screen');
  // HOME_URL: risolto dinamicamente per funzionare sia in locale sia su GitHub Pages
  const HOME_URL = new URL('../../index.html', window.location.href).href;

  function openConfirmHome(e) {
    e.preventDefault();              
    confirmHomeScreen.classList.add('show');
  }

  document.querySelector('.btn-back-home')?.addEventListener('click', openConfirmHome);
  document.querySelector('.btn-back-home-mobile')?.addEventListener('click', openConfirmHome);

  document.getElementById('btn-confirm-home-yes').addEventListener('click', () => {
    window.location.href = HOME_URL;
  });

  document.getElementById('btn-confirm-home-no').addEventListener('click', () => {
    confirmHomeScreen.classList.remove('show');
  });

  /* =====================================================
     INIT
     ===================================================== */
  buildItems();

}); // fine DOMContentLoaded
