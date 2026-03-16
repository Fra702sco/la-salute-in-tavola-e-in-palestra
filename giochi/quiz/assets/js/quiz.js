/* ============================================================
   QUIZ ALIMENTARE — quiz.js
   ────────────────────────────────────────────────────────────
   Struttura:
     §0  Config & Costanti
     §1  Domande (banca dati 70+ domande, 9 categorie)
     §2  Mappa categorie (background, emoji, palette)
     §3  Riferimenti DOM
     §4  Stato di gioco
     §5  Sistema Audio
     §6  Sistema Background & Particelle
     §7  Sistema Timer (domanda + totale)
     §8  Motore di gioco (start → domanda → risposta → fine)
     §9  Sistema Feedback & Toast
     §10 Sistema Confetti
     §11 Sistema Stelle (valutazione finale)
     §12 Gestione Schermate (successo / gameover)
     §13 Pannelli (confirm-home, about)
     §14 Scorciatoie tastiera
     §15 Event Listeners
     §16 Init
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

/* ============================================================
   §0  CONFIG & COSTANTI
   ============================================================ */
const CFG = Object.freeze({
  DOMANDE_PER_PARTITA : 15,
  MAX_ERRORI          : 3,
  SECONDI_DOMANDA     : 15,
  TEMPO_TOTALE_SEC    : 245,          // 4 min 5 sec
  URGENZA_SOGLIA      : 5,            // secondi → tremore bottoni
  FEEDBACK_DURATA_MS  : 1400,         // ms feedback visibile
  PAUSA_PROSSIMA_MS   : 1600,         // ms prima della prossima domanda
  TIMER_CIRCUMFERENCE : 326.7,        // 2π × r52
  HOME_URL            : new URL('../../index.html', window.location.href).href,
  AUDIO_VOL_BG        : 0.22,
  AUDIO_VOL_FX        : 0.75,
});


/* ============================================================
   §1  BANCA DATI DOMANDE  (popolato da fetch in §16)
   ============================================================ */
let DOMANDE = [

  /* ── FRUTTA ── */
  {
    categoria: 'frutta',
    testo: '🍎 Quale vitamina è presente in abbondanza nelle arance?',
    risposte: ['Vitamina A', 'Vitamina C', 'Vitamina D', 'Vitamina K'],
    corretta: 1,
  },
  {
    categoria: 'frutta',
    testo: '🍌 Quale frutto è ricco di potassio e aiuta i muscoli?',
    risposte: ['Mela', 'Pera', 'Banana', 'Anguria'],
    corretta: 2,
  },
  {
    categoria: 'frutta',
    testo: '🍇 Di che colore sono i frutti più ricchi di antiossidanti?',
    risposte: ['Giallo', 'Bianco', 'Viola/Blu', 'Verde'],
    corretta: 2,
  },
  {
    categoria: 'frutta',
    testo: '🍓 Quanti pezzi di frutta si consiglia di mangiare al giorno?',
    risposte: ['1', '2-3', '5-6', '10'],
    corretta: 1,
  },
  {
    categoria: 'frutta',
    testo: '🥝 Il kiwi contiene più vitamina C di quale altro frutto?',
    risposte: ['Banana', 'Arancia', 'Pesca', 'Fico'],
    corretta: 1,
  },
  {
    categoria: 'frutta',
    testo: '🍑 La frutta è un alimento da mangiare preferibilmente…',
    risposte: ['Dopo cena', 'Come spuntino o a colazione', 'Solo a pranzo', 'Mai a stomaco vuoto'],
    corretta: 1,
  },
  {
    categoria: 'frutta',
    testo: '🍍 Quale frutto tropicale aiuta la digestione grazie alla bromelina?',
    risposte: ['Mango', 'Papaya', 'Ananas', 'Cocco'],
    corretta: 2,
  },
  {
    categoria: 'frutta',
    testo: '🍒 Cosa rende la frutta secca (uvetta, albicocche) diversa dalla frutta fresca?',
    risposte: ['Ha meno zuccheri', 'Ha più acqua', 'È più calorica per peso', 'Non ha vitamine'],
    corretta: 2,
  },

  /* ── VERDURA ── */
  {
    categoria: 'verdura',
    testo: '🥦 Quale verdura è famosa per le sue proprietà anti-cancro ed è ricca di vitamina C?',
    risposte: ['Zucchina', 'Broccolo', 'Cetriolo', 'Sedano'],
    corretta: 1,
  },
  {
    categoria: 'verdura',
    testo: '🥕 Quale vitamina è presente in grande quantità nelle carote?',
    risposte: ['Vitamina B12', 'Vitamina C', 'Vitamina A (beta-carotene)', 'Vitamina E'],
    corretta: 2,
  },
  {
    categoria: 'verdura',
    testo: '🍃 Gli spinaci sono ricchi di quale minerale importante per il sangue?',
    risposte: ['Calcio', 'Ferro', 'Magnesio', 'Zinco'],
    corretta: 1,
  },
  {
    categoria: 'verdura',
    testo: '🧅 Qual è il vantaggio di mangiare verdure crude rispetto a quelle cotte?',
    risposte: ['Sono più gustose', 'Conservano meglio le vitamine', 'Hanno più calorie', 'Sono più facili da digerire'],
    corretta: 1,
  },
  {
    categoria: 'verdura',
    testo: '🥗 Quante porzioni di verdura si raccomanda di mangiare ogni giorno?',
    risposte: ['1', '2-3', '5-7', 'Solo 1 a settimana'],
    corretta: 1,
  },
  {
    categoria: 'verdura',
    testo: '🌽 Il mais è classificato come verdura o cereale?',
    risposte: ['Solo verdura', 'Solo cereale', 'Entrambi, dipende dall\'uso', 'Né l\'uno né l\'altro'],
    corretta: 2,
  },
  {
    categoria: 'verdura',
    testo: '🍅 Il pomodoro, pur usato come verdura, è botanicamente…',
    risposte: ['Una radice', 'Un legume', 'Un frutto', 'Un fungo'],
    corretta: 2,
  },
  {
    categoria: 'verdura',
    testo: '🥒 Quale verdura è composta per circa il 95% di acqua?',
    risposte: ['Carota', 'Patata', 'Cetriolo', 'Cipolla'],
    corretta: 2,
  },

  /* ── CEREALI ── */
  {
    categoria: 'cereali',
    testo: '🍞 Quale nutriente fornisce principalmente il pane e la pasta?',
    risposte: ['Proteine', 'Grassi', 'Carboidrati', 'Fibre'],
    corretta: 2,
  },
  {
    categoria: 'cereali',
    testo: '🌾 Perché il pane integrale è più sano di quello bianco?',
    risposte: ['Ha più calorie', 'Contiene più fibre e nutrienti', 'È più dolce', 'Ha meno carboidrati'],
    corretta: 1,
  },
  {
    categoria: 'cereali',
    testo: '🍚 Il riso è un alimento che appartiene al gruppo dei…',
    risposte: ['Latticini', 'Legumi', 'Cereali', 'Proteine animali'],
    corretta: 2,
  },
  {
    categoria: 'cereali',
    testo: '🌽 Quale cereale è privo di glutine ed è adatto ai celiaci?',
    risposte: ['Frumento', 'Orzo', 'Mais', 'Segale'],
    corretta: 2,
  },
  {
    categoria: 'cereali',
    testo: '🥣 La colazione ideale include cereali perché…',
    risposte: ['Stancano subito', 'Danno energia a lungo termine', 'Fanno dormire', 'Non hanno sapore'],
    corretta: 1,
  },
  {
    categoria: 'cereali',
    testo: '🍝 Quante volte a settimana è consigliato mangiare pasta o riso?',
    risposte: ['Solo 1 volta', '2-3 volte', 'Ogni giorno va bene', 'Mai a cena'],
    corretta: 2,
  },
  {
    categoria: 'cereali',
    testo: '🌾 L\'avena è famosa per contenere quale fibra benefica per il cuore?',
    risposte: ['Cellulosa', 'Beta-glucano', 'Pectina', 'Inulina'],
    corretta: 1,
  },

  /* ── LATTICINI ── */
  {
    categoria: 'latticini',
    testo: '🥛 Quale minerale fondamentale per le ossa è abbondante nel latte?',
    risposte: ['Ferro', 'Potassio', 'Calcio', 'Magnesio'],
    corretta: 2,
  },
  {
    categoria: 'latticini',
    testo: '🧀 Quale formaggio italiano ha meno grassi tra questi?',
    risposte: ['Parmigiano', 'Mozzarella', 'Ricotta', 'Gorgonzola'],
    corretta: 2,
  },
  {
    categoria: 'latticini',
    testo: '🥚 Le uova appartengono al gruppo dei latticini?',
    risposte: ['Sì, sempre', 'No, sono proteine animali', 'Solo le uova di gallina', 'Dipende da come le cucini'],
    corretta: 1,
  },
  {
    categoria: 'latticini',
    testo: '🥛 Quante porzioni di latticini si consigliano al giorno per bambini in crescita?',
    risposte: ['1', '2-3', '5-6', 'Nessuna'],
    corretta: 1,
  },
  {
    categoria: 'latticini',
    testo: '🍦 Lo yogurt bianco naturale è più sano dello yogurt alla frutta industriale perché…',
    risposte: ['È più dolce', 'Ha meno zuccheri aggiunti', 'Ha più grassi', 'Costa meno'],
    corretta: 1,
  },
  {
    categoria: 'latticini',
    testo: '🧈 Il burro è un latticino ricco principalmente di…',
    risposte: ['Proteine', 'Carboidrati', 'Grassi saturi', 'Fibre'],
    corretta: 2,
  },

  /* ── PROTEINE ── */
  {
    categoria: 'proteine',
    testo: '🍗 Le proteine servono principalmente per…',
    risposte: ['Dare energia rapida', 'Costruire e riparare i muscoli', 'Idratare il corpo', 'Proteggere i denti'],
    corretta: 1,
  },
  {
    categoria: 'proteine',
    testo: '🐟 Quale pesce è ricco di omega-3, benefico per il cuore e il cervello?',
    risposte: ['Merluzzo', 'Salmone', 'Sogliola', 'Branzino'],
    corretta: 1,
  },
  {
    categoria: 'proteine',
    testo: '🫘 I legumi (fagioli, lenticchie) sono una fonte proteica di tipo…',
    risposte: ['Animale', 'Minerale', 'Vegetale', 'Sintetico'],
    corretta: 2,
  },
  {
    categoria: 'proteine',
    testo: '🥩 Quante volte a settimana è consigliato mangiare carne rossa?',
    risposte: ['Ogni giorno', '1-2 volte', '5 volte', 'Mai'],
    corretta: 1,
  },
  {
    categoria: 'proteine',
    testo: '🍳 Un uovo contiene circa quanti grammi di proteine?',
    risposte: ['2g', '6g', '15g', '25g'],
    corretta: 1,
  },
  {
    categoria: 'proteine',
    testo: '🐟 Il pesce azzurro (sardine, sgombro) è consigliato almeno…',
    risposte: ['Una volta al mese', '2-3 volte a settimana', 'Ogni giorno', 'Mai'],
    corretta: 1,
  },
  {
    categoria: 'proteine',
    testo: '🫘 Le lenticchie, oltre alle proteine, sono ottime fonti di…',
    risposte: ['Vitamina C', 'Ferro e fibre', 'Omega-3', 'Calcio'],
    corretta: 1,
  },

  /* ── DOLCI ── */
  {
    categoria: 'dolci',
    testo: '🍬 Quanti zuccheri aggiunti al giorno si consiglia di non superare per i bambini?',
    risposte: ['50g', '25g', '100g', 'Nessun limite'],
    corretta: 1,
  },
  {
    categoria: 'dolci',
    testo: '🍫 Il cioccolato fondente (>70%) è preferibile a quello al latte perché…',
    risposte: ['È più dolce', 'Ha più zuccheri', 'Ha più antiossidanti e meno zuccheri', 'Costa meno'],
    corretta: 2,
  },
  {
    categoria: 'dolci',
    testo: '🥤 Le bibite zuccherate sono sconsigliate principalmente perché…',
    risposte: ['Hanno buon sapore', 'Contengono moltissimo zucchero senza nutrienti', 'Idratano troppo', 'Costano poco'],
    corretta: 1,
  },
  {
    categoria: 'dolci',
    testo: '🍰 La merenda ideale per un bambino dovrebbe essere…',
    risposte: ['Una merendina confezionata', 'Frutta e uno yogurt', 'Una torta intera', 'Solo acqua'],
    corretta: 1,
  },
  {
    categoria: 'dolci',
    testo: '🍭 Mangiare molti zuccheri può causare problemi a…',
    risposte: ['I capelli', 'I denti e il peso corporeo', 'La vista', 'Le unghie'],
    corretta: 1,
  },
  {
    categoria: 'dolci',
    testo: '🧁 Con quale frequenza si consiglia di consumare dolci e dolciumi?',
    risposte: ['Ogni giorno', 'Solo a colazione', 'Occasionalmente, poche volte a settimana', 'Mai'],
    corretta: 2,
  },

  /* ── SPORT ── */
  {
    categoria: 'sport',
    testo: '🏃 Quanti minuti di attività fisica moderata si consigliano ai bambini ogni giorno?',
    risposte: ['10 minuti', '30 minuti', '60 minuti', '120 minuti'],
    corretta: 2,
  },
  {
    categoria: 'sport',
    testo: '💪 Fare sport regolarmente aiuta a…',
    risposte: ['Aumentare solo il peso', 'Rafforzare muscoli e ossa e migliorare l\'umore', 'Stancare troppo il cuore', 'Ridurre la concentrazione'],
    corretta: 1,
  },
  {
    categoria: 'sport',
    testo: '🚰 Durante l\'attività fisica è importante bere…',
    risposte: ['Bibite gassate', 'Succhi di frutta', 'Acqua', 'Latte'],
    corretta: 2,
  },
  {
    categoria: 'sport',
    testo: '🤸 Quale sport migliora la flessibilità e l\'equilibrio?',
    risposte: ['Sollevamento pesi', 'Yoga/Ginnastica', 'Darts', 'Scacchi'],
    corretta: 1,
  },
  {
    categoria: 'sport',
    testo: '🏊 Nuotare è un\'attività fisica definita…',
    risposte: ['Ad alto impatto', 'A basso impatto (protegge le articolazioni)', 'Pericolosa per i bambini', 'Solo per adulti'],
    corretta: 1,
  },
  {
    categoria: 'sport',
    testo: '⚽ Lo sport di squadra aiuta i bambini anche a livello…',
    risposte: ['Solo fisico', 'Solo mentale', 'Sociale ed emotivo, oltre che fisico', 'Non aiuta'],
    corretta: 2,
  },
  {
    categoria: 'sport',
    testo: '🚴 Andare in bicicletta è un ottimo esercizio per…',
    risposte: ['Solo le braccia', 'Il sistema cardiovascolare e le gambe', 'Solo la schiena', 'Niente in particolare'],
    corretta: 1,
  },

  /* ── ACQUA ── */
  {
    categoria: 'acqua',
    testo: '💧 Quanta acqua dovrebbe bere un bambino ogni giorno?',
    risposte: ['1-2 bicchieri', '3-4 bicchieri', '6-8 bicchieri', '12+ bicchieri'],
    corretta: 2,
  },
  {
    categoria: 'acqua',
    testo: '🧊 Il corpo umano di un bambino è composto di acqua per circa…',
    risposte: ['20%', '40%', '60-70%', '90%'],
    corretta: 2,
  },
  {
    categoria: 'acqua',
    testo: '🥤 Quale bevanda è la migliore per idratarsi durante il giorno?',
    risposte: ['Succo di frutta industriale', 'Bibita gassata', 'Acqua naturale', 'Tè zuccherato'],
    corretta: 2,
  },
  {
    categoria: 'acqua',
    testo: '💧 La disidratazione lieve può causare…',
    risposte: ['Più energia', 'Difficoltà di concentrazione e mal di testa', 'Fame eccessiva', 'Visione migliorata'],
    corretta: 1,
  },
  {
    categoria: 'acqua',
    testo: '🫧 Quale organo usa più acqua nel corpo umano?',
    risposte: ['Lo stomaco', 'I polmoni', 'Il cervello', 'Le ossa'],
    corretta: 2,
  },
  {
    categoria: 'acqua',
    testo: '🌊 Anche alcuni alimenti ci aiutano ad idratarci. Quale tra questi ha più acqua?',
    risposte: ['Pane', 'Anguria', 'Cracker', 'Formaggio stagionato'],
    corretta: 1,
  },

  /* ── VITAMINE ── */
  {
    categoria: 'vitamine',
    testo: '☀️ La vitamina D viene prodotta dal nostro corpo grazie a…',
    risposte: ['Il cibo', 'L\'esposizione al sole', 'L\'esercizio fisico', 'Il sonno'],
    corretta: 1,
  },
  {
    categoria: 'vitamine',
    testo: '🦴 La vitamina D è fondamentale per la salute di…',
    risposte: ['I capelli', 'Le ossa e i denti', 'La digestione', 'La memoria'],
    corretta: 1,
  },
  {
    categoria: 'vitamine',
    testo: '🩸 La vitamina K è essenziale per…',
    risposte: ['La vista', 'La coagulazione del sangue', 'La crescita', 'Il sonno'],
    corretta: 1,
  },
  {
    categoria: 'vitamine',
    testo: '👀 La vitamina A è particolarmente importante per…',
    risposte: ['Le ossa', 'La vista e la pelle', 'I muscoli', 'Il cuore'],
    corretta: 1,
  },
  {
    categoria: 'vitamine',
    testo: '🥜 La vitamina E si trova principalmente in…',
    risposte: ['Carne rossa', 'Frutta e verdura', 'Oli vegetali e frutta secca', 'Zucchero'],
    corretta: 2,
  },
  {
    categoria: 'vitamine',
    testo: '🧬 Le vitamine del gruppo B sono importanti principalmente per…',
    risposte: ['I denti', 'Il metabolismo energetico e il sistema nervoso', 'La pelle', 'Le ossa'],
    corretta: 1,
  },
  {
    categoria: 'vitamine',
    testo: '🍊 Quale vitamina si ossida (si distrugge) velocemente con il calore?',
    risposte: ['Vitamina A', 'Vitamina D', 'Vitamina C', 'Vitamina K'],
    corretta: 2,
  },
  {
    categoria: 'vitamine',
    testo: '🌈 Per assumere tutte le vitamine necessarie, la regola d\'oro è…',
    risposte: ['Mangiare solo carne', 'Prendere integratori ogni giorno', 'Mangiare alimenti variati e colorati', 'Bere solo succhi'],
    corretta: 2,
  },

];


/* ============================================================
   §2  MAPPA CATEGORIE  (popolato da fetch in §16)
   ============================================================ */
let CATEGORIE = {
  frutta: {
    label    : '🍎 Frutta',
    emoji    : ['🍎','🍊','🍋','🍇','🍓','🍑','🥝','🍒','🍌','🍍','🥭','🍐'],
    bgClass  : 'bg-frutta',
    timerColor: '#e53935',
  },
  verdura: {
    label    : '🥦 Verdura',
    emoji    : ['🥦','🥕','🍃','🧅','🥗','🌽','🍅','🥒','🫑','🧄','🥬','🫛'],
    bgClass  : 'bg-verdura',
    timerColor: '#43a047',
  },
  cereali: {
    label    : '🌾 Cereali',
    emoji    : ['🌾','🍞','🥖','🍚','🥣','🌽','🍝','🥐','🫓','🧇'],
    bgClass  : 'bg-cereali',
    timerColor: '#f57f17',
  },
  latticini: {
    label    : '🥛 Latticini',
    emoji    : ['🥛','🧀','🍦','🥚','🧈','🫙','🍶','🥛','🧁'],
    bgClass  : 'bg-latticini',
    timerColor: '#1565c0',
  },
  proteine: {
    label    : '🍗 Proteine',
    emoji    : ['🍗','🐟','🫘','🥩','🍳','🦐','🥚','🦞','🫀'],
    bgClass  : 'bg-proteine',
    timerColor: '#6a1b9a',
  },
  dolci: {
    label    : '🍬 Dolci & Zuccheri',
    emoji    : ['🍬','🍫','🍭','🍰','🧁','🍮','🍩','🍪','🎂','🍡'],
    bgClass  : 'bg-dolci',
    timerColor: '#ad1457',
  },
  sport: {
    label    : '🏃 Sport & Movimento',
    emoji    : ['🏃','💪','🤸','🏊','⚽','🚴','🤾','🏋️','🧗','⛹️'],
    bgClass  : 'bg-sport',
    timerColor: '#00838f',
  },
  acqua: {
    label    : '💧 Idratazione',
    emoji    : ['💧','🌊','🫧','🧊','🚰','☔','🌧️','🫙','🏞️'],
    bgClass  : 'bg-acqua',
    timerColor: '#0277bd',
  },
  vitamine: {
    label    : '🌈 Vitamine',
    emoji    : ['☀️','🌈','🧬','💊','🫐','🌿','🍵','🧪','✨'],
    bgClass  : 'bg-vitamine',
    timerColor: '#558b2f',
  },
};


/* ============================================================
   §3  RIFERIMENTI DOM
   ============================================================ */
const DOM = (() => {
  const q = id => document.getElementById(id);
  const qs = sel => document.querySelector(sel);
  return {
    /* Schermate */
    startScreen    : q('start-screen'),
    gameScreen     : q('game-screen'),
    successScreen  : q('success-screen'),
    gameoverScreen : q('gameover-screen'),
    confirmHome    : q('confirm-home-screen'),
    aboutPanel     : q('about-panel'),
    /* Bottoni start */
    btnStart       : q('btn-start'),
    /* Bottoni header */
    btnHome        : q('btn-home'),
    btnRestart     : q('btn-restart'),
    btnAbout       : q('btn-about'),
    btnBgToggle    : q('btn-bg-toggle'),
    /* Domanda */
    questionNum    : q('question-num'),
    questionText   : q('question-text'),
    questionCat    : q('question-category'),
    /* Timer domanda */
    timerDisplay   : q('timer-display'),
    timerRingFill  : q('timer-ring-fill'),
    /* Timer totale */
    totalTimerDisp : q('total-timer-display'),
    /* Errori */
    errDots        : [q('err-1'), q('err-2'), q('err-3')],
    /* Risposte */
    answersGrid    : q('answers-grid'),
    answerBtns     : [q('ans-0'), q('ans-1'), q('ans-2'), q('ans-3')],
    /* Feedback */
    feedback       : q('answer-feedback'),
    /* Background */
    bgScene        : q('bg-scene'),
    bgParticles    : q('bg-particles'),
    /* Risultati */
    successCorrect : q('success-correct'),
    successWrong   : q('success-wrong'),
    successTime    : q('success-time'),
    successStars   : q('success-stars'),
    gameoverCorrect: q('gameover-correct'),
    gameoverWrong  : q('gameover-wrong'),
    gameoverReached: q('gameover-reached'),
    gameoverReason : q('gameover-reason'),
    /* Riepilogo errori */
    recapSuccess   : q('recap-errori-success'),
    recapGameover  : q('recap-errori-gameover'),
    /* Buttons risultato */
    btnPlayAgain   : q('btn-play-again'),
    btnRetry       : q('btn-retry'),
    btnConfirmYes  : q('btn-confirm-home-yes'),
    btnConfirmNo   : q('btn-confirm-home-no'),
    btnAboutClose  : q('btn-about-close'),
    /* Toast */
    toast          : q('toast-banner'),
    toastIcon      : q('toast-icon'),
    toastText      : q('toast-text'),
    /* Confetti */
    confetti       : q('confetti-container'),
    /* Progress */
    progressFill   : qs('.question-progress-fill'),
  };
})();


/* ============================================================
   §4  STATO DI GIOCO
   ============================================================ */
let S = {};  // stato corrente, resettato in resetState()

function resetState() {
  S = {
    /* Domande */
    mazzoCorrente : [],           // array domande mescolate
    indice        : 0,            // indice domanda corrente
    risposto      : false,        // l'utente ha già risposto?
    /* Punteggio */
    corrette      : 0,
    errori        : 0,
    /* Timer domanda */
    timerDomanda  : null,         // setInterval
    secondiRimasti: CFG.SECONDI_DOMANDA,
    /* Timer totale */
    timerTotale   : null,         // setInterval
    secondiTotali : CFG.TEMPO_TOTALE_SEC,
    /* Timestamp inizio (per stats) */
    tsInizio      : 0,
    /* Log domande sbagliate per il riepilogo finale */
    erroriLog     : [],   // { domanda, rispostaData, rispostaGiusta, tempoSecondi }
    /* Partita attiva */
    attiva        : false,
    /* Musica attiva */
    musicaOn      : false,
    /* Schermata iniziale visibile */
    startVisible  : true,
  };
}

resetState();


/* ============================================================
   §5  SISTEMA AUDIO
   ============================================================ */
const AUDIO = (() => {
  const fx = {
    correct  : document.getElementById('audio-correct'),
    wrong    : document.getElementById('audio-wrong'),
    victory  : document.getElementById('audio-victory'),
    gameover : document.getElementById('audio-gameover'),
    tick     : document.getElementById('audio-tick'),
    bg       : document.getElementById('audio-bg'),
  };

  // Volume iniziale
  if (fx.bg) fx.bg.volume = CFG.AUDIO_VOL_BG;
  ['correct','wrong','victory','gameover','tick'].forEach(k => {
    if (fx[k]) fx[k].volume = CFG.AUDIO_VOL_FX;
  });

  function play(key) {
    const el = fx[key];
    if (!el) return;
    try {
      el.currentTime = 0;
      el.play().catch(() => {});
    } catch (_) {}
  }

  function startBg() {
    if (!fx.bg) return;
    fx.bg.currentTime = 0;
    fx.bg.play().catch(() => {});
    S.musicaOn = true;
    DOM.btnBgToggle.textContent = '🎵';
    DOM.btnBgToggle.classList.add('on');
  }

  function stopBg() {
    if (!fx.bg) return;
    fx.bg.pause();
    S.musicaOn = false;
    DOM.btnBgToggle.textContent = '🔇';
    DOM.btnBgToggle.classList.remove('on');
  }

  function toggleBg() {
    S.musicaOn ? stopBg() : startBg();
  }

  return { play, startBg, stopBg, toggleBg };
})();


/* ============================================================
   §6  SISTEMA BACKGROUND & PARTICELLE
   ============================================================ */
const BG = (() => {

  let particleTimers = [];

  function clear() {
    particleTimers.forEach(t => clearTimeout(t));
    particleTimers = [];
    DOM.bgParticles.innerHTML = '';
    DOM.bgScene.className = '';
  }

  function setCat(categoria) {
    const cat = CATEGORIE[categoria] || CATEGORIE['frutta'];
    clear();
    // Aggiungi classe gradiente
    DOM.bgScene.classList.add(cat.bgClass || 'bg-default');
    // Genera particelle a ondate per effetto dinamico
    const totalParticles = 28;
    for (let i = 0; i < totalParticles; i++) {
      const t = setTimeout(() => spawnParticle(cat.emoji), i * 180);
      particleTimers.push(t);
    }
    // Rimpiazza le particelle ogni 14 secondi (per partita lunga)
    const replenishId = setInterval(() => {
      for (let i = 0; i < 6; i++) {
        const t2 = setTimeout(() => spawnParticle(cat.emoji), i * 250);
        particleTimers.push(t2);
      }
    }, 14000);
    particleTimers.push(replenishId);
  }

  function spawnParticle(emojiArr) {
    const el = document.createElement('span');
    el.className = 'bg-particle';

    // Classi velocità casuali
    const speeds = ['slow','medium','medium','fast','tiny'];
    el.classList.add(speeds[Math.floor(Math.random() * speeds.length)]);

    // Emoji casuale dall'array categoria
    el.textContent = emojiArr[Math.floor(Math.random() * emojiArr.length)];

    // Posizione orizzontale casuale
    el.style.left = `${Math.random() * 98}%`;

    // Delay start casuale
    const delay = Math.random() * 8;
    el.style.animationDelay = `${delay}s`;

    // Durata leggermente randomizzata
    const baseDur = parseFloat(getComputedStyle(el).animationDuration) || 12;
    el.style.animationDuration = `${baseDur * (0.8 + Math.random() * 0.4)}s`;

    // Opacità leggermente variabile
    // el.style.opacity = (0.3 + Math.random() * 0.5).toString();

    DOM.bgParticles.appendChild(el);

    // Rimuovi dopo 30s per non intasare il DOM
    const removeId = setTimeout(() => el.remove(), (baseDur + delay + 2) * 1000);
    particleTimers.push(removeId);
  }

  return { setCat, clear };
})();


/* ============================================================
   §7  SISTEMA TIMER
   ============================================================ */
const TIMER = (() => {

  /* ── Timer domanda ── */
  function startDomanda() {
    clearInterval(S.timerDomanda);
    S.secondiRimasti = CFG.SECONDI_DOMANDA;
    aggiornaRingUI(CFG.SECONDI_DOMANDA);
    DOM.timerDisplay.classList.remove('warning','danger');
    DOM.timerRingFill.classList.remove('warning','danger');
    DOM.timerDisplay.setAttribute('aria-label', `${CFG.SECONDI_DOMANDA} secondi rimasti`);

    S.timerDomanda = setInterval(() => {
      S.secondiRimasti--;
      aggiornaRingUI(S.secondiRimasti);

      // Colore warning
      if (S.secondiRimasti <= 5 && S.secondiRimasti > 0) {
        DOM.timerDisplay.classList.add('warning');
        DOM.timerRingFill.classList.add('warning');
        DOM.timerDisplay.classList.remove('danger');
        DOM.timerRingFill.classList.remove('danger');
        DOM.timerDisplay.setAttribute('aria-label', `Attenzione! Solo ${S.secondiRimasti} secondi rimasti`);
        setUrgenza(true);
        AUDIO.play('tick');
      }

      if (S.secondiRimasti <= 3) {
        DOM.timerDisplay.classList.remove('warning');
        DOM.timerRingFill.classList.remove('warning');
        DOM.timerDisplay.classList.add('danger');
        DOM.timerRingFill.classList.add('danger');
        DOM.timerDisplay.setAttribute('aria-label', `Urgente! Solo ${S.secondiRimasti} secondi rimasti`);
      }

      if (S.secondiRimasti <= 0) {
        clearInterval(S.timerDomanda);
        onTimeout();
      }
    }, 1000);
  }

  function stopDomanda() {
    clearInterval(S.timerDomanda);
    setUrgenza(false);
  }

  function aggiornaRingUI(sec) {
    DOM.timerDisplay.textContent = sec;
    const fraction = sec / CFG.SECONDI_DOMANDA;
    const offset   = CFG.TIMER_CIRCUMFERENCE * (1 - fraction);
    DOM.timerRingFill.style.strokeDashoffset = offset.toFixed(1);
    // Progress bar domanda
    if (DOM.progressFill) {
      DOM.progressFill.style.width = `${(fraction * 100).toFixed(1)}%`;
    }
  }

  function setUrgenza(on) {
    DOM.answerBtns.forEach(btn => {
      if (on && !S.risposto) btn.classList.add('urgent');
      else btn.classList.remove('urgent');
    });
  }

  /* ── Timer totale ── */
  function startTotale() {
    clearInterval(S.timerTotale);
    S.secondiTotali = CFG.TEMPO_TOTALE_SEC;
    aggiornaTotaleUI(S.secondiTotali);
    DOM.totalTimerDisp.classList.remove('warning');

    S.timerTotale = setInterval(() => {
      S.secondiTotali--;
      aggiornaTotaleUI(S.secondiTotali);

      if (S.secondiTotali <= 30) {
        DOM.totalTimerDisp.classList.add('warning');
      }

      if (S.secondiTotali <= 0) {
        clearInterval(S.timerTotale);
        stopDomanda();
        onTempoTotaleScaduto();
      }
    }, 1000);
  }

  function stopTotale() {
    clearInterval(S.timerTotale);
  }

  function aggiornaTotaleUI(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    DOM.totalTimerDisp.textContent = `${m}:${String(s).padStart(2,'0')}`;
  }

  function stopAll() {
    stopDomanda();
    stopTotale();
    setUrgenza(false);
  }

  function tempoUsatoStringa() {
    const usato = CFG.TEMPO_TOTALE_SEC - S.secondiTotali;
    const m = Math.floor(usato / 60);
    const s = usato % 60;
    return `${m}:${String(s).padStart(2,'0')}`;
  }

  return { startDomanda, stopDomanda, startTotale, stopTotale, stopAll, tempoUsatoStringa };
})();


/* ============================================================
   §8  MOTORE DI GIOCO
   ============================================================ */

/* ── Mescola array (Fisher-Yates) ── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ── Avvia partita ── */
function startGame() {
  resetState();
  S.attiva   = true;
  S.tsInizio = Date.now();

  // Scegli 15 domande randomiche, bilanciate per categoria
  S.mazzoCorrente = shuffle(DOMANDE).slice(0, CFG.DOMANDE_PER_PARTITA);

  // UI
  DOM.startScreen.classList.add('hide');
  setTimeout(() => {
    DOM.startScreen.style.display = 'none';
    S.startVisible = false;
  }, 580);
  DOM.gameScreen.removeAttribute('hidden');

  // Aggiorna errori UI (reset visuale)
  DOM.errDots.forEach(d => d.classList.remove('active'));

  // Musica
  AUDIO.startBg();

  // Timer totale
  TIMER.startTotale();

  // Prima domanda
  caricaDomanda(0);
}

/* ── Carica domanda ── */
function caricaDomanda(idx) {
  S.indice    = idx;
  S.risposto  = false;
  const domanda = S.mazzoCorrente[idx];
  const cat     = CATEGORIE[domanda.categoria] || CATEGORIE['frutta'];

  // Background categoria
  BG.setCat(domanda.categoria);

  // Badge categoria
  DOM.questionCat.textContent = cat.label;

  // Testo domanda (con animazione)
  DOM.questionText.style.opacity = '0';
  DOM.questionText.style.transform = 'translateY(8px)';
  requestAnimationFrame(() => {
    DOM.questionText.textContent = domanda.testo;
    DOM.questionText.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    DOM.questionText.style.opacity = '1';
    DOM.questionText.style.transform = 'translateY(0)';
  });

  // Contatore domanda
  DOM.questionNum.textContent = idx + 1;
  DOM.questionNum.classList.remove('bump');
  void DOM.questionNum.offsetWidth; // reflow per restart animation
  DOM.questionNum.classList.add('bump');

  // Mescola le risposte mantenendo traccia della corretta
  const risposteMescolate = shuffle(
    domanda.risposte.map((testo, i) => ({ testo, corretto: i === domanda.corretta }))
  );

  const lettere = ['A','B','C','D'];
  DOM.answerBtns.forEach((btn, i) => {
    const r = risposteMescolate[i];
    btn.disabled  = false;
    btn.className = 'answer-btn';
    btn.setAttribute('aria-label', `Risposta ${lettere[i]}`);
    btn.innerHTML = `<span class="answer-letter" aria-hidden="true">${lettere[i]}</span>${r.testo}`;
    btn.dataset.corretta = r.corretto ? '1' : '0';
    btn.setAttribute('aria-pressed', 'false');
  });

  // Feedback reset
  DOM.feedback.textContent = '';
  DOM.feedback.className   = 'answer-feedback';

  // Avvia timer domanda
  TIMER.startDomanda();
}

/* ── Risposta selezionata ── */
function onRisposta(btnIdx) {
  if (S.risposto || !S.attiva) return;
  S.risposto = true;
  TIMER.stopDomanda();

  const btn = DOM.answerBtns[btnIdx];
  const corretta = btn.dataset.corretta === '1';

  // Evidenzia risposta corretta in ogni caso
  DOM.answerBtns.forEach(b => {
    b.disabled = true;
    b.classList.remove('urgent');
    if (b.dataset.corretta === '1') b.classList.add('correct');
  });

  const getAnswerText = b => b.textContent.replace(/^[A-D]/, '').trim();

  if (corretta) {
    S.corrette++;
    btn.classList.add('correct');
    AUDIO.play('correct');
    TOAST.mostra('ok', '✅', 'Risposta corretta!');
  } else {
    S.errori++;
    btn.classList.add('wrong');
    AUDIO.play('wrong');
    aggiornaDotErrore(S.errori);
    TOAST.mostra('ko', '❌', 'Risposta sbagliata!');
    const corrBtn = DOM.answerBtns.find(b => b.dataset.corretta === '1');
    S.erroriLog.push({
      domanda      : S.mazzoCorrente[S.indice].testo,
      rispostaData : getAnswerText(btn),
      rispostaGiusta: corrBtn ? getAnswerText(corrBtn) : '?',
      tempoSecondi : CFG.SECONDI_DOMANDA - S.secondiRimasti,
    });
  }

  // Verifica game over immediato
  if (S.errori > CFG.MAX_ERRORI) {
    setTimeout(() => finePartita('errori'), CFG.PAUSA_PROSSIMA_MS);
    return;
  }

  // Ultima domanda?
  if (S.indice + 1 >= CFG.DOMANDE_PER_PARTITA) {
    setTimeout(() => finePartita('vittoria'), CFG.PAUSA_PROSSIMA_MS);
    return;
  }

  // Prossima domanda
  setTimeout(() => caricaDomanda(S.indice + 1), CFG.PAUSA_PROSSIMA_MS);
}

/* ── Timeout domanda ── */
function onTimeout() {
  if (S.risposto || !S.attiva) return;
  S.risposto = true;

  S.errori++;
  AUDIO.play('wrong');
  aggiornaDotErrore(S.errori);
  TOAST.mostra('timeout', '⏱️', 'Tempo scaduto!');

  // Mostra risposta corretta
  DOM.answerBtns.forEach(b => {
    b.disabled = true;
    b.classList.remove('urgent');
    if (b.dataset.corretta === '1') b.classList.add('correct');
  });

  // Log timeout come errore nel riepilogo
  const corrBtnTO = DOM.answerBtns.find(b => b.dataset.corretta === '1');
  const getAnswerTextTO = b => b.textContent.replace(/^[A-D]/, '').trim();
  S.erroriLog.push({
    domanda      : S.mazzoCorrente[S.indice].testo,
    rispostaData : '— nessuna (tempo scaduto)',
    rispostaGiusta: corrBtnTO ? getAnswerTextTO(corrBtnTO) : '?',
    tempoSecondi : CFG.SECONDI_DOMANDA,
  });

  if (S.errori > CFG.MAX_ERRORI) {
    setTimeout(() => finePartita('errori'), CFG.PAUSA_PROSSIMA_MS);
    return;
  }

  if (S.indice + 1 >= CFG.DOMANDE_PER_PARTITA) {
    setTimeout(() => finePartita('vittoria'), CFG.PAUSA_PROSSIMA_MS);
    return;
  }

  setTimeout(() => caricaDomanda(S.indice + 1), CFG.PAUSA_PROSSIMA_MS);
}

/* ── Tempo totale scaduto ── */
function onTempoTotaleScaduto() {
  if (!S.attiva) return;
  S.attiva = false;
  TIMER.stopAll();
  AUDIO.play('gameover');
  finePartita('timeout_totale');
}

/* ── Fine partita ── */
function finePartita(motivo) {
  S.attiva = false;
  TIMER.stopAll();
  BG.clear();
  DOM.bgScene.classList.add('bg-default');

  if (motivo === 'vittoria') {
    AUDIO.stopBg();
    AUDIO.play('victory');
    SCHERMATE.mostraSuccesso();
    CONFETTI.lancia();
  } else {
    AUDIO.stopBg();
    AUDIO.play('gameover');
    const ragione = motivo === 'errori'
      ? `Hai commesso ${CFG.MAX_ERRORI + 1} errori!`
      : '⏳ Hai esaurito il tempo totale!';
    SCHERMATE.mostraGameover(ragione);
  }
}

/* ── Aggiorna dot errori ── */
function aggiornaDotErrore(n) {
  if (n >= 1 && n <= 3) {
    DOM.errDots[n - 1].classList.add('active');
  }
}

/* ── Restart ── */
function restartGame() {
  TIMER.stopAll();
  BG.clear();
  DOM.successScreen.classList.remove('show');
  DOM.gameoverScreen.classList.remove('show');
  DOM.gameScreen.removeAttribute('hidden');
  startGame();
}


/* ── Riepilogo errori ── */
function buildRecap(container) {
  container.innerHTML = '';
  const title = document.createElement('div');
  title.className = 'recap-title';
  title.textContent = S.erroriLog.length === 0
    ? '📋 Riepilogo'
    : `📋 Riepilogo errori (${S.erroriLog.length})`;
  container.appendChild(title);

  if (S.erroriLog.length === 0) {
    const ok = document.createElement('p');
    ok.className = 'recap-perfect';
    ok.textContent = '🎉 Nessun errore! Risposta perfetta!';
    container.appendChild(ok);
    return;
  }

  S.erroriLog.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'recap-item';
    div.innerHTML =
      `<div class="recap-num">Errore ${i + 1}</div>` +
      `<div class="recap-q">${item.domanda}</div>` +
      `<div class="recap-wrong">❌ Hai risposto: <strong>${item.rispostaData}</strong></div>` +
      `<div class="recap-right">✅ Risposta giusta: <strong>${item.rispostaGiusta}</strong></div>` +
      `<div class="recap-time">⏱️ Tempo impiegato: <strong>${item.tempoSecondi}s su ${CFG.SECONDI_DOMANDA}s</strong></div>`;
    container.appendChild(div);
  });
}


/* ============================================================
   §9  SISTEMA FEEDBACK & TOAST
   ============================================================ */
const FEEDBACK = (() => {
  let tid = null;
  function mostra(tipo, testo) {
    clearTimeout(tid);
    DOM.feedback.textContent = testo;
    DOM.feedback.className   = `answer-feedback ${tipo}`;
    tid = setTimeout(() => {
      DOM.feedback.textContent = '';
      DOM.feedback.className   = 'answer-feedback';
    }, CFG.FEEDBACK_DURATA_MS + 400);
  }
  return { mostra };
})();

const TOAST = (() => {
  let tid = null;
  function mostra(tipo, icon, testo) {
    clearTimeout(tid);
    DOM.toastIcon.textContent = icon;
    DOM.toastText.textContent = testo;
    DOM.toast.className = `${tipo} show`;
    DOM.toast.setAttribute('aria-hidden','false');
    tid = setTimeout(() => {
      DOM.toast.classList.remove('show');
      DOM.toast.setAttribute('aria-hidden','true');
    }, 2200);
  }
  return { mostra };
})();


/* ============================================================
   §10 SISTEMA CONFETTI
   ============================================================ */
const CONFETTI = (() => {
  const COLORI = [
    '#ffd600','#ff9800','#e53935','#43a047',
    '#1565c0','#9c27b0','#00acc1','#f06292','#fff176',
  ];
  const FORME = ['■','●','▲','★','♦','✦'];

  function lancia() {
    DOM.confetti.innerHTML = '';
    const n = 90;
    for (let i = 0; i < n; i++) {
      setTimeout(() => crea(), i * 28);
    }
  }

  function crea() {
    const el = document.createElement('span');
    el.className = 'confetti-piece';
    el.textContent = FORME[Math.floor(Math.random() * FORME.length)];
    el.style.cssText = [
      `left:${Math.random() * 100}%`,
      `color:${COLORI[Math.floor(Math.random() * COLORI.length)]}`,
      `font-size:${10 + Math.random() * 16}px`,
      `animation-duration:${2.2 + Math.random() * 2}s`,
      `animation-delay:${Math.random() * 0.5}s`,
    ].join(';');
    DOM.confetti.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }

  return { lancia };
})();




/* ============================================================
   §11 SISTEMA STELLE (valutazione finale)
   ============================================================ */
function calcolaStelle(corrette, errori) {
  if (errori === 0)                   return '⭐⭐⭐';
  if (errori <= 1)                    return '⭐⭐✨';
  if (errori <= CFG.MAX_ERRORI)       return '⭐✨✨';
  return '✨✨✨';
}


/* ============================================================
   §12 GESTIONE SCHERMATE RISULTATO
   ============================================================ */
const SCHERMATE = (() => {

  function mostraSuccesso() {
    const stelle = calcolaStelle(S.corrette, S.errori);
    DOM.successCorrect.textContent = S.corrette;
    DOM.successWrong.textContent   = S.errori;
    DOM.successTime.textContent    = TIMER.tempoUsatoStringa();
    DOM.successStars.textContent   = stelle;
    buildRecap(DOM.recapSuccess);
    DOM.gameScreen.setAttribute('hidden','');
    DOM.successScreen.classList.add('show');
  }

  function mostraGameover(ragione) {
    DOM.gameoverCorrect.textContent = S.corrette;
    DOM.gameoverWrong.textContent   = S.errori;
    DOM.gameoverReached.textContent = `${S.indice + 1} / ${CFG.DOMANDE_PER_PARTITA}`;
    DOM.gameoverReason.textContent  = ragione;
    buildRecap(DOM.recapGameover);
    DOM.gameScreen.setAttribute('hidden','');
    DOM.gameoverScreen.classList.add('show');
  }

  return { mostraSuccesso, mostraGameover };
})();


/* ============================================================
   §13 PANNELLI (confirm-home, about)
   ============================================================ */
function apriConfirmHome() {
  DOM.confirmHome.classList.add('show');
  DOM.confirmHome.setAttribute('aria-hidden','false');
}

function chiudiConfirmHome() {
  DOM.confirmHome.classList.remove('show');
  DOM.confirmHome.setAttribute('aria-hidden','true');
}

function apriAbout() {
  DOM.aboutPanel.classList.add('show');
  DOM.aboutPanel.setAttribute('aria-hidden','false');
}

function chiudiAbout() {
  DOM.aboutPanel.classList.remove('show');
  DOM.aboutPanel.setAttribute('aria-hidden','true');
}


/* ============================================================
   §14 SCORCIATOIE TASTIERA
   ============================================================ */
document.addEventListener('keydown', e => {
  // Blocca tutto sulla start screen
  if (S.startVisible) return;

  // ESC — chiudi pannelli
  if (e.key === 'Escape') {
    chiudiConfirmHome();
    chiudiAbout();
    return;
  }

  // 1/2/3/4 — seleziona risposta
  if (['1','2','3','4'].includes(e.key) && S.attiva && !S.risposto) {
    e.preventDefault();
    onRisposta(parseInt(e.key) - 1);
    return;
  }

  // A/B/C/D — seleziona risposta
  const letterMap = { a: 0, b: 1, c: 2, d: 3 };
  if (e.key.toLowerCase() in letterMap && S.attiva && !S.risposto) {
    e.preventDefault();
    onRisposta(letterMap[e.key.toLowerCase()]);
    return;
  }

  const isMac = navigator.platform.toUpperCase().includes('MAC');
  const ctrl  = isMac ? e.metaKey : e.ctrlKey;

  // Ctrl+R — restart
  if (ctrl && e.key.toLowerCase() === 'r' && S.attiva) {
    e.preventDefault();
    restartGame();
  }
});


/* ============================================================
   §15 EVENT LISTENERS
   ============================================================ */

/* Start */
DOM.btnStart.addEventListener('click', startGame);

/* Risposte */
DOM.answerBtns.forEach((btn, i) => {
  btn.addEventListener('click', () => onRisposta(i));
});

/* Header — Home */
DOM.btnHome.addEventListener('click', e => {
  e.preventDefault();
  if (S.attiva) apriConfirmHome();
  else window.location.href = CFG.HOME_URL;
});

/* Header — Restart */
DOM.btnRestart.addEventListener('click', () => {
  if (S.attiva) restartGame();
});

/* Header — About */
DOM.btnAbout.addEventListener('click', apriAbout);

/* Header — Musica */
DOM.btnBgToggle.addEventListener('click', AUDIO.toggleBg);

/* Confirm home */
DOM.btnConfirmYes.addEventListener('click', () => {
  window.location.href = CFG.HOME_URL;
});
DOM.btnConfirmNo.addEventListener('click', chiudiConfirmHome);

/* About */
DOM.btnAboutClose.addEventListener('click', chiudiAbout);

/* Risultati */
DOM.btnPlayAgain.addEventListener('click', () => {
  DOM.successScreen.classList.remove('show');
  restartGame();
});
DOM.btnRetry.addEventListener('click', () => {
  DOM.gameoverScreen.classList.remove('show');
  restartGame();
});

/* Click fuori dai pannelli per chiuderli */
DOM.confirmHome.addEventListener('click', e => {
  if (e.target === DOM.confirmHome) chiudiConfirmHome();
});

/* Swipe mobile — risposta */
let touchStartX = 0;
DOM.answersGrid.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

DOM.answersGrid.addEventListener('touchend', e => {
  // Solo se non è un tap (ha swipato)
  const dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
  if (dx < 10) return; // è un tap, non fare nulla
}, { passive: true });


/* ============================================================
   §16 INIT
   ============================================================ */
(async function init() {
  // Stato iniziale schermate
  DOM.successScreen.classList.remove('show');
  DOM.gameoverScreen.classList.remove('show');
  DOM.confirmHome.classList.remove('show');
  DOM.aboutPanel.classList.remove('show');
  DOM.gameScreen.setAttribute('hidden','');

  // Carica domande e categorie dal file JSON
  DOM.btnStart.disabled = true;
  DOM.btnStart.textContent = '⏳ Caricamento...';
  try {
    const res  = await fetch('assets/domande-risposte/domande.json');
    const data = await res.json();
    DOMANDE    = data.domande;
    CATEGORIE  = data.categorie;
    DOM.btnStart.disabled    = false;
    DOM.btnStart.textContent = '🎮 Inizia a giocare!';
  } catch (err) {
    console.error('Errore caricamento domande:', err);
    DOM.btnStart.textContent = '❌ Errore caricamento';
    const errEl = document.getElementById('load-error');
    if (errEl) errEl.hidden = false;
  }

  // Background di default sulla start screen
  DOM.bgScene.classList.add('bg-default');

  // Particelle festive sulla start screen
  const startEmoji = ['🥗','🍎','🥦','💧','🏃','🌾','🥛','🍗','🌈','☀️','🍬','🐟'];
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('span');
    el.className = 'bg-particle';
    el.classList.add(['slow','medium','fast','tiny'][Math.floor(Math.random() * 4)]);
    el.textContent = startEmoji[Math.floor(Math.random() * startEmoji.length)];
    el.style.left = `${Math.random() * 98}%`;
    el.style.animationDelay = `${Math.random() * 10}s`;
    DOM.bgParticles.appendChild(el);
  }

  // Accessibilità aria-hidden iniziale
  DOM.confirmHome.setAttribute('aria-hidden','true');
  DOM.aboutPanel.setAttribute('aria-hidden','true');
  DOM.toast.setAttribute('aria-hidden','true');
})();

/* ─── fine DOMContentLoaded ─── */
});
