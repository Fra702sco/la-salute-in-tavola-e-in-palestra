/* ============================================================
   IL PANINO PERFETTO — game.js (Redesign con immagini SVG)
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

/* ── Immagini SVG realistiche degli alimenti ── */
const FOOD_SVG = {
  pomodoro: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="pt" cx="40%" cy="35%" r="55%"><stop offset="0%" stop-color="#ff6b6b"/><stop offset="60%" stop-color="#e53935"/><stop offset="100%" stop-color="#c62828"/></radialGradient></defs><ellipse cx="52" cy="90" rx="28" ry="5" fill="rgba(0,0,0,.1)"/><circle cx="50" cy="48" r="36" fill="url(#pt)"/><ellipse cx="38" cy="34" rx="12" ry="8" fill="rgba(255,255,255,.2)" transform="rotate(-15 38 34)"/><path d="M50,14 Q50,48 50,84" stroke="rgba(183,28,28,.2)" stroke-width=".8" fill="none"/><path d="M16,48 Q50,48 84,48" stroke="rgba(183,28,28,.2)" stroke-width=".8" fill="none"/><circle cx="50" cy="48" r="7" fill="rgba(198,40,40,.25)"/><path d="M42,14 L46,22 M50,10 L50,20 M58,14 L54,22" stroke="#2e7d32" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="13" rx="7" ry="3.5" fill="#43a047"/></svg>`,

  lattuga: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="pl" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a5d6a7"/><stop offset="50%" stop-color="#66bb6a"/><stop offset="100%" stop-color="#43a047"/></linearGradient></defs><ellipse cx="52" cy="92" rx="28" ry="5" fill="rgba(0,0,0,.1)"/><path d="M50,10 Q18,28 14,55 Q12,72 26,82 Q38,90 50,87 Q62,90 74,82 Q88,72 86,55 Q82,28 50,10Z" fill="url(#pl)"/><path d="M50,10 Q45,38 28,58 Q20,70 28,80" stroke="rgba(27,94,32,.3)" stroke-width="1.8" fill="none"/><path d="M50,10 Q55,38 72,58 Q80,70 72,80" stroke="rgba(27,94,32,.3)" stroke-width="1.8" fill="none"/><path d="M50,10 Q48,48 50,87" stroke="rgba(27,94,32,.35)" stroke-width="2" fill="none"/><ellipse cx="38" cy="28" rx="10" ry="6" fill="rgba(200,230,201,.35)" transform="rotate(-20 38 28)"/></svg>`,

  mozzarella: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="pm" cx="40%" cy="35%" r="55%"><stop offset="0%" stop-color="#fffde7"/><stop offset="40%" stop-color="#fff9c4"/><stop offset="100%" stop-color="#f0ead0"/></radialGradient></defs><ellipse cx="52" cy="90" rx="28" ry="5" fill="rgba(0,0,0,.08)"/><ellipse cx="50" cy="50" rx="36" ry="34" fill="url(#pm)"/><ellipse cx="50" cy="50" rx="36" ry="34" fill="none" stroke="#ddd5a0" stroke-width="1.5"/><ellipse cx="36" cy="36" rx="15" ry="10" fill="rgba(255,255,255,.45)" transform="rotate(-10 36 36)"/><ellipse cx="62" cy="60" rx="8" ry="5" fill="rgba(255,255,255,.2)" transform="rotate(15 62 60)"/></svg>`,

  prosciutto: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="ph" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f8bbd0"/><stop offset="50%" stop-color="#f06292"/><stop offset="100%" stop-color="#e91e63"/></linearGradient></defs><ellipse cx="52" cy="90" rx="28" ry="5" fill="rgba(0,0,0,.08)"/><ellipse cx="50" cy="48" rx="38" ry="30" fill="url(#ph)" transform="rotate(-3 50 48)"/><ellipse cx="50" cy="48" rx="38" ry="30" fill="none" stroke="#c2185b" stroke-width="1" transform="rotate(-3 50 48)"/><ellipse cx="35" cy="40" rx="6" ry="8" fill="rgba(255,255,255,.18)" transform="rotate(-12 35 40)"/><ellipse cx="60" cy="52" rx="5" ry="7" fill="rgba(255,255,255,.12)"/><ellipse cx="42" cy="34" rx="12" ry="5" fill="rgba(255,255,255,.15)" transform="rotate(-8 42 34)"/><path d="M18,48 Q28,44 38,48 Q48,44 58,48" stroke="rgba(173,20,87,.12)" stroke-width=".8" fill="none"/></svg>`,

  tonno: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="ptn" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffccbc"/><stop offset="50%" stop-color="#ff8a65"/><stop offset="100%" stop-color="#e64a19"/></linearGradient></defs><ellipse cx="52" cy="90" rx="28" ry="5" fill="rgba(0,0,0,.08)"/><ellipse cx="50" cy="50" rx="36" ry="28" fill="url(#ptn)"/><ellipse cx="50" cy="50" rx="36" ry="28" fill="none" stroke="#bf360c" stroke-width="1"/><path d="M20,50 Q35,44 50,50 Q65,44 80,50" stroke="rgba(191,54,12,.2)" stroke-width=".8" fill="none"/><path d="M22,42 Q35,38 50,42 Q65,38 78,42" stroke="rgba(191,54,12,.15)" stroke-width=".8" fill="none"/><ellipse cx="38" cy="42" rx="10" ry="6" fill="rgba(255,255,255,.15)" transform="rotate(-8 38 42)"/></svg>`,

  uovo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="pu" cx="50%" cy="45%" r="50%"><stop offset="0%" stop-color="#fffde7"/><stop offset="80%" stop-color="#fff9c4"/><stop offset="100%" stop-color="#f5f0d0"/></radialGradient><radialGradient id="py" cx="45%" cy="40%" r="50%"><stop offset="0%" stop-color="#ffd54f"/><stop offset="70%" stop-color="#ffb300"/><stop offset="100%" stop-color="#ff8f00"/></radialGradient></defs><ellipse cx="52" cy="90" rx="28" ry="5" fill="rgba(0,0,0,.08)"/><ellipse cx="50" cy="50" rx="34" ry="34" fill="url(#pu)"/><ellipse cx="50" cy="50" rx="34" ry="34" fill="none" stroke="#e0d8a0" stroke-width="1.5"/><circle cx="50" cy="50" r="16" fill="url(#py)"/><circle cx="50" cy="50" r="16" fill="none" stroke="#f9a825" stroke-width="1"/><ellipse cx="44" cy="44" rx="6" ry="4" fill="rgba(255,255,255,.35)" transform="rotate(-15 44 44)"/></svg>`,

  cetriolo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="pc" cx="50%" cy="45%" r="50%"><stop offset="0%" stop-color="#c8e6c9"/><stop offset="40%" stop-color="#81c784"/><stop offset="100%" stop-color="#388e3c"/></radialGradient></defs><ellipse cx="52" cy="90" rx="28" ry="5" fill="rgba(0,0,0,.08)"/><circle cx="50" cy="48" r="34" fill="url(#pc)"/><circle cx="50" cy="48" r="34" fill="none" stroke="#2e7d32" stroke-width="1.5"/><circle cx="50" cy="48" r="24" fill="rgba(200,230,201,.5)"/><circle cx="50" cy="48" r="24" fill="none" stroke="rgba(56,142,60,.3)" stroke-width="1"/><circle cx="42" cy="38" r="3" fill="rgba(255,255,255,.5)"/><circle cx="58" cy="38" r="3" fill="rgba(255,255,255,.5)"/><circle cx="50" cy="55" r="3" fill="rgba(255,255,255,.5)"/><circle cx="38" cy="50" r="2.5" fill="rgba(255,255,255,.4)"/><circle cx="62" cy="50" r="2.5" fill="rgba(255,255,255,.4)"/><circle cx="45" cy="60" r="2.5" fill="rgba(255,255,255,.35)"/><circle cx="56" cy="60" r="2.5" fill="rgba(255,255,255,.35)"/></svg>`,

  carota: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="pcr" x1="30%" y1="0%" x2="70%" y2="100%"><stop offset="0%" stop-color="#ffb74d"/><stop offset="50%" stop-color="#ff9800"/><stop offset="100%" stop-color="#e65100"/></linearGradient></defs><ellipse cx="52" cy="92" rx="20" ry="4" fill="rgba(0,0,0,.08)"/><path d="M50,15 Q38,40 32,65 Q28,82 40,90 L60,90 Q72,82 68,65 Q62,40 50,15Z" fill="url(#pcr)"/><path d="M50,15 Q38,40 32,65 Q28,82 40,90 L60,90 Q72,82 68,65 Q62,40 50,15Z" fill="none" stroke="#bf360c" stroke-width="1.2"/><path d="M38,45 Q50,42 62,45" stroke="rgba(191,54,12,.2)" stroke-width="1" fill="none"/><path d="M35,58 Q50,55 65,58" stroke="rgba(191,54,12,.2)" stroke-width="1" fill="none"/><path d="M37,72 Q50,69 63,72" stroke="rgba(191,54,12,.2)" stroke-width="1" fill="none"/><path d="M44,12 L48,22 M50,8 L50,18 M56,12 L52,22" stroke="#2e7d32" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="10" rx="8" ry="4" fill="#43a047"/></svg>`,

  patatine: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="pf" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fff176"/><stop offset="50%" stop-color="#fdd835"/><stop offset="100%" stop-color="#f9a825"/></linearGradient></defs><ellipse cx="52" cy="92" rx="24" ry="4" fill="rgba(0,0,0,.08)"/><rect x="22" y="45" width="56" height="44" rx="6" fill="#e53935"/><rect x="22" y="45" width="56" height="44" rx="6" fill="none" stroke="#c62828" stroke-width="1.5"/><rect x="30" y="18" width="8" height="42" rx="3" fill="url(#pf)" transform="rotate(-8 34 39)"/><rect x="40" y="12" width="8" height="46" rx="3" fill="url(#pf)" transform="rotate(3 44 35)"/><rect x="50" y="16" width="8" height="44" rx="3" fill="url(#pf)" transform="rotate(-5 54 38)"/><rect x="60" y="20" width="8" height="40" rx="3" fill="url(#pf)" transform="rotate(6 64 40)"/><rect x="35" y="22" width="7" height="36" rx="3" fill="url(#pf)" transform="rotate(10 38 40)"/></svg>`,

  cioccolato: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="pch" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8d6e63"/><stop offset="50%" stop-color="#6d4c41"/><stop offset="100%" stop-color="#4e342e"/></linearGradient></defs><ellipse cx="52" cy="92" rx="30" ry="5" fill="rgba(0,0,0,.1)"/><rect x="14" y="24" width="72" height="56" rx="6" fill="url(#pch)"/><rect x="14" y="24" width="72" height="56" rx="6" fill="none" stroke="#3e2723" stroke-width="1.5"/><line x1="38" y1="24" x2="38" y2="80" stroke="rgba(62,39,35,.4)" stroke-width="1.5"/><line x1="62" y1="24" x2="62" y2="80" stroke="rgba(62,39,35,.4)" stroke-width="1.5"/><line x1="14" y1="43" x2="86" y2="43" stroke="rgba(62,39,35,.4)" stroke-width="1.5"/><line x1="14" y1="62" x2="86" y2="62" stroke="rgba(62,39,35,.4)" stroke-width="1.5"/><rect x="16" y="26" width="20" height="15" rx="2" fill="rgba(255,255,255,.08)"/></svg>`,

  caramella: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="pca" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e040fb"/><stop offset="50%" stop-color="#ab47bc"/><stop offset="100%" stop-color="#7b1fa2"/></linearGradient></defs><ellipse cx="52" cy="92" rx="24" ry="4" fill="rgba(0,0,0,.08)"/><path d="M10,50 Q10,36 20,32 L30,28" stroke="#ce93d8" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M70,72 Q80,68 90,50" stroke="#ce93d8" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="50" rx="28" ry="22" fill="url(#pca)"/><ellipse cx="50" cy="50" rx="28" ry="22" fill="none" stroke="#6a1b9a" stroke-width="1.5"/><path d="M30,40 Q50,34 70,40" stroke="rgba(255,255,255,.3)" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28,50 Q50,44 72,50" stroke="rgba(255,255,255,.15)" stroke-width="2" fill="none"/><ellipse cx="40" cy="42" rx="8" ry="5" fill="rgba(255,255,255,.15)" transform="rotate(-15 40 42)"/></svg>`,

  gelato: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="pg1" cx="50%" cy="40%" r="50%"><stop offset="0%" stop-color="#fff9c4"/><stop offset="60%" stop-color="#fdd835"/><stop offset="100%" stop-color="#f9a825"/></radialGradient><radialGradient id="pg2" cx="50%" cy="40%" r="50%"><stop offset="0%" stop-color="#ffccbc"/><stop offset="60%" stop-color="#ff8a65"/><stop offset="100%" stop-color="#e64a19"/></radialGradient><linearGradient id="pgc" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffe0b2"/><stop offset="100%" stop-color="#d4a055"/></linearGradient></defs><ellipse cx="50" cy="94" rx="10" ry="3" fill="rgba(0,0,0,.08)"/><path d="M34,48 L44,92 L56,92 L66,48Z" fill="url(#pgc)"/><path d="M34,48 L44,92 L56,92 L66,48Z" fill="none" stroke="#8d6e63" stroke-width="1"/><path d="M38,58 L62,58 M40,68 L60,68 M42,78 L58,78" stroke="rgba(139,90,43,.2)" stroke-width="1" fill="none"/><circle cx="50" cy="34" r="20" fill="url(#pg1)"/><circle cx="36" cy="28" r="14" fill="url(#pg2)"/><circle cx="64" cy="28" r="14" fill="#f8bbd0"/><ellipse cx="42" cy="24" rx="6" ry="4" fill="rgba(255,255,255,.3)" transform="rotate(-20 42 24)"/></svg>`,

  ciambella: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="pd" cx="50%" cy="45%" r="50%"><stop offset="0%" stop-color="#efbf76"/><stop offset="70%" stop-color="#d4a055"/><stop offset="100%" stop-color="#b8863c"/></radialGradient></defs><ellipse cx="52" cy="92" rx="30" ry="5" fill="rgba(0,0,0,.1)"/><circle cx="50" cy="50" r="36" fill="url(#pd)"/><circle cx="50" cy="50" r="36" fill="none" stroke="#8d6e63" stroke-width="1.5"/><circle cx="50" cy="50" r="14" fill="#F57C00"/><circle cx="50" cy="50" r="14" fill="none" stroke="#8d6e63" stroke-width="1.2"/><path d="M18,38 Q50,18 82,38 Q86,48 78,50 Q50,30 22,50 Q14,48 18,38Z" fill="#f48fb1"/><path d="M18,38 Q50,18 82,38 Q86,48 78,50 Q50,30 22,50 Q14,48 18,38Z" fill="none" stroke="#e91e63" stroke-width="1"/><circle cx="30" cy="34" r="3" fill="#fff176"/><circle cx="45" cy="26" r="2.5" fill="#81d4fa"/><circle cx="58" cy="28" r="3" fill="#a5d6a7"/><circle cx="70" cy="34" r="2.5" fill="#fff176"/><circle cx="38" cy="42" r="2" fill="#ce93d8"/></svg>`,

  leccalecca: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="pll" cx="50%" cy="45%" r="50%"><stop offset="0%" stop-color="#ef5350"/><stop offset="100%" stop-color="#c62828"/></radialGradient></defs><rect x="47" y="62" width="6" height="34" rx="3" fill="#bcaaa4"/><rect x="47" y="62" width="6" height="34" rx="3" fill="none" stroke="#8d6e63" stroke-width="1"/><circle cx="50" cy="36" r="28" fill="url(#pll)"/><circle cx="50" cy="36" r="28" fill="none" stroke="#b71c1c" stroke-width="1.5"/><path d="M50,10 Q60,16 60,28 Q60,40 50,46 Q40,40 40,28 Q40,16 50,10Z" fill="rgba(255,255,255,.2)"/><path d="M34,22 Q42,14 50,22 Q58,14 66,22" stroke="rgba(255,255,255,.25)" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M30,36 Q42,28 50,36 Q58,28 70,36" stroke="rgba(255,255,255,.2)" stroke-width="2.5" fill="none"/><ellipse cx="40" cy="26" rx="6" ry="4" fill="rgba(255,255,255,.2)" transform="rotate(-15 40 26)"/></svg>`,

  cupcake: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="pck" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#8d6e63"/><stop offset="100%" stop-color="#5d4037"/></linearGradient><radialGradient id="pcf" cx="50%" cy="40%" r="55%"><stop offset="0%" stop-color="#f8bbd0"/><stop offset="60%" stop-color="#f06292"/><stop offset="100%" stop-color="#e91e63"/></radialGradient></defs><ellipse cx="50" cy="94" rx="22" ry="4" fill="rgba(0,0,0,.08)"/><path d="M30,55 L35,90 L65,90 L70,55Z" fill="url(#pck)"/><path d="M30,55 L35,90 L65,90 L70,55Z" fill="none" stroke="#3e2723" stroke-width="1.2"/><path d="M34,65 L66,65 M36,75 L64,75 M37,85 L63,85" stroke="rgba(255,255,255,.1)" stroke-width="1" fill="none"/><path d="M28,55 Q35,30 50,24 Q65,30 72,55Z" fill="url(#pcf)"/><path d="M28,55 Q35,30 50,24 Q65,30 72,55Z" fill="none" stroke="#c2185b" stroke-width="1"/><path d="M32,48 Q42,38 50,42 Q58,38 68,48" stroke="rgba(255,255,255,.25)" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="50" cy="22" r="5" fill="#e53935"/><circle cx="50" cy="22" r="5" fill="none" stroke="#c62828" stroke-width="1"/><ellipse cx="50" cy="20" rx="2" ry="1.5" fill="rgba(255,255,255,.3)"/></svg>`,

  bibita: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="pb" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#e53935"/><stop offset="50%" stop-color="#c62828"/><stop offset="100%" stop-color="#b71c1c"/></linearGradient></defs><ellipse cx="50" cy="94" rx="18" ry="4" fill="rgba(0,0,0,.08)"/><rect x="30" y="18" width="40" height="72" rx="6" fill="url(#pb)"/><rect x="30" y="18" width="40" height="72" rx="6" fill="none" stroke="#b71c1c" stroke-width="1.5"/><rect x="30" y="14" width="40" height="10" rx="4" fill="#bdbdbd"/><rect x="30" y="14" width="40" height="10" rx="4" fill="none" stroke="#9e9e9e" stroke-width="1"/><ellipse cx="42" cy="19" rx="4" ry="2" fill="rgba(255,255,255,.3)"/><rect x="34" y="40" width="32" height="28" rx="3" fill="rgba(255,255,255,.9)"/><path d="M40,48 Q50,42 60,48 Q50,54 40,48Z" fill="#c62828"/><rect x="38" y="56" width="24" height="3" rx="1.5" fill="#c62828"/><rect x="42" y="61" width="16" height="2" rx="1" fill="#c62828" opacity=".6"/></svg>`,
};

/* Converte SVG markup in data URI per img src */
function svgToDataURI(svgMarkup) {
  return 'data:image/svg+xml,' + encodeURIComponent(svgMarkup);
}

const FOODS = [
  /* ── Corretti (sani per un panino) ── */
  { id: 'pomodoro',    emoji: '\u{1F345}', name: 'Pomodoro',         correct: true },
  { id: 'lattuga',     emoji: '\u{1F96C}', name: 'Lattuga',          correct: true },
  { id: 'mozzarella',  emoji: '\u{1F9C0}', name: 'Mozzarella',       correct: true },
  { id: 'prosciutto',  emoji: '\u{1F969}', name: 'Prosciutto cotto', correct: true },
  { id: 'tonno',       emoji: '\u{1F41F}', name: 'Tonno',            correct: true },
  { id: 'uovo',        emoji: '\u{1F95A}', name: 'Uovo sodo',        correct: true },
  { id: 'cetriolo',    emoji: '\u{1F952}', name: 'Cetriolo',         correct: true },
  { id: 'carota',      emoji: '\u{1F955}', name: 'Carota',           correct: true },
  /* ── Errati (non adatti a un panino sano) ── */
  { id: 'patatine',    emoji: '\u{1F35F}', name: 'Patatine fritte',  correct: false },
  { id: 'cioccolato',  emoji: '\u{1F36B}', name: 'Cioccolato',       correct: false },
  { id: 'caramella',   emoji: '\u{1F36C}', name: 'Caramella',        correct: false },
  { id: 'gelato',      emoji: '\u{1F366}', name: 'Gelato',           correct: false },
  { id: 'ciambella',   emoji: '\u{1F369}', name: 'Ciambella',        correct: false },
  { id: 'leccalecca',  emoji: '\u{1F36D}', name: 'Lecca-lecca',      correct: false },
  { id: 'cupcake',     emoji: '\u{1F9C1}', name: 'Cupcake',          correct: false },
  { id: 'bibita',      emoji: '\u{1F964}', name: 'Bibita gassata',   correct: false },
];

const HAPPY = [
  'Buona scelta! \u{1F44D}', 'Ottimo! \u{1F389}', 'Che buono! \u{1F60B}',
  'Perfetto! \u2B50',         'Bravo! \u{1F4AA}',  'Sano e gustoso! \u{1F31F}',
];

const SAD = [
  'Bleah! \u{1F922}',         'Non nel panino! \u{1F645}', 'Nooo! \u{1F631}',
  'Non \u00E8 sano! \u{1F635}', 'Sbagliato! \u{1F494}',   'Questo no! \u{1F92E}',
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
  childImg    : $('child-img'),
  childSpeech : $('child-speech'),
  speechText  : $('speech-text'),
  sandwich    : $('sandwich'),
  grid        : $('ingredients-grid'),
  confetti    : $('confetti-container'),
  lossTitle   : $('loss-title'),
  lossDesc    : $('loss-desc'),
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
   §3  AUDIO (Web Audio API)
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
   §4  TIMER
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
   §5  COMBO STORAGE
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
    try { localStorage.removeItem(COMBO_KEY); } catch {}
    return [];
  }
}

function saveCombo(ids) {
  const combos = loadCombos();
  combos.push([...ids].sort());
  try { localStorage.setItem(COMBO_KEY, JSON.stringify(combos)); } catch {}
}

function isDuplicate(ids) {
  const key = [...ids].sort();
  return loadCombos().some(c =>
    c.length === key.length && c.every((v, i) => v === key[i]));
}


/* ============================================================
   §6  BAMBINO — REAZIONI
   ============================================================ */
/* Gestisce l'espressione del bambino cambiando immagine */
const CHILD_IMG_HAPPY = 'assets/img/bambino-felice.jpeg';
const CHILD_IMG_SAD   = 'assets/img/bambino-triste.png';

function setFaceState(state) {
  if (!DOM.childImg) return;
  DOM.childImg.classList.remove('face-happy', 'face-sad');
  if (state === 'happy') {
    DOM.childImg.src = CHILD_IMG_HAPPY;
    DOM.childImg.classList.add('face-happy');
  } else if (state === 'sad') {
    DOM.childImg.src = CHILD_IMG_SAD;
    DOM.childImg.classList.add('face-sad');
  } else {
    DOM.childImg.src = CHILD_IMG_HAPPY;
  }
}

function childSay(type, msg) {
  clearTimeout(S.speechTid);

  DOM.child.classList.remove('happy', 'sad', 'idle');
  void DOM.child.offsetWidth;

  setFaceState(type === 'happy' ? 'happy' : type === 'sad' ? 'sad' : 'normal');
  if (type) DOM.child.classList.add(type);

  DOM.speechText.textContent = msg;
  DOM.childSpeech.removeAttribute('hidden');

  S.speechTid = setTimeout(() => {
    setFaceState('normal');
    DOM.child.classList.remove('happy', 'sad');
    DOM.child.classList.add('idle');
    DOM.childSpeech.setAttribute('hidden', '');
  }, ANIM_COOLDOWN);
}


/* ============================================================
   §7  ERRORI
   ============================================================ */
function updateDots() {
  for (let i = 1; i <= MAX_ERRORS; i++) {
    const d = $(`err-${i}`);
    if (d) d.classList.toggle('active', i <= S.errors);
  }
}


/* ============================================================
   §8  INGREDIENTI — GRIGLIA
   ============================================================ */
function shuffle(arr) {
  const b = [...arr];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

function createFoodImg(foodId, cls) {
  const svg = FOOD_SVG[foodId];
  if (svg) {
    const img = document.createElement('img');
    img.className = cls;
    img.src = svgToDataURI(svg);
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    return img;
  }
  /* Fallback: emoji */
  const food = FOODS.find(f => f.id === foodId);
  const span = document.createElement('span');
  span.className = 'ing-emoji';
  span.textContent = food ? food.emoji : '';
  return span;
}

function buildGrid() {
  DOM.grid.textContent = '';

  shuffle(FOODS).forEach(food => {
    const btn = document.createElement('button');
    btn.className = 'ing-btn';
    btn.dataset.id = food.id;
    btn.setAttribute('aria-label', food.name);

    /* Immagine SVG dell'alimento */
    const img = createFoodImg(food.id, 'ing-food-img');
    btn.appendChild(img);

    const nm = document.createElement('span');
    nm.className = 'ing-name';
    nm.textContent = food.name;

    btn.appendChild(nm);
    btn.addEventListener('click', () => pickIngredient(food, btn));
    DOM.grid.appendChild(btn);
  });
}


/* ============================================================
   §9  SELEZIONE INGREDIENTE
   ============================================================ */
function pickIngredient(food, btn) {
  if (!S.active || S.animating || S.placed.length >= MAX_SLOTS || btn.disabled) return;

  S.animating = true;
  btn.disabled = true;
  btn.classList.add('used');

  const slotIdx = S.placed.length + 1;
  const slot    = $(`slot-${slotIdx}`);

  /* Immagine realistica nello slot */
  const img = createFoodImg(food.id, 'slot-food-img');
  slot.appendChild(img);

  const sn = document.createElement('span');
  sn.className   = 'slot-name';
  sn.textContent = food.name;
  slot.appendChild(sn);

  slot.classList.add('filled', food.correct ? 'slot-ok' : 'slot-ko');

  S.placed.push(food);

  setTimeout(() => {
    if (food.correct) {
      AUDIO.correct();
      childSay('happy', HAPPY[Math.floor(Math.random() * HAPPY.length)]);
    } else {
      AUDIO.wrong();
      S.errors++;
      updateDots();
      childSay('sad', SAD[Math.floor(Math.random() * SAD.length)]);

      if (S.errors >= MAX_ERRORS) {
        setTimeout(() => endGame('errors'), ANIM_COOLDOWN);
        return;
      }
    }

    if (S.placed.length >= MAX_SLOTS) {
      setTimeout(sealSandwich, ANIM_COOLDOWN + 200);
    } else {
      setTimeout(() => { S.animating = false; }, ANIM_COOLDOWN);
    }
  }, 450);
}


/* ============================================================
   §10 PANINO COMPLETO
   ============================================================ */
function sealSandwich() {
  if (!S.active) return;

  AUDIO.seal();

  setTimeout(() => {
    if (!S.active) return;

    const ids = S.placed.map(f => f.id);

    if (isDuplicate(ids)) {
      childSay('sad', 'Questo panino l\'hai gi\u00E0 fatto! \u{1F504}');
      setTimeout(() => endGame('duplicate'), 5000);
      return;
    }

    saveCombo(ids);

    if (S.placed.every(f => f.correct)) {
      setTimeout(gameWin, 600);
    } else {
      childSay('sad', 'Panino non perfetto! Riprova! \u{1F504}');
      setTimeout(resetSandwich, 2200);
    }
  }, 800);
}


/* ============================================================
   §11 RESET PANINO
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

  buildGrid();
}


/* ============================================================
   §12 VITTORIA
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
   §13 GAME OVER
   ============================================================ */
function endGame(reason) {
  if (!S.active) return;
  S.active = false;
  stopTimer();
  AUDIO.lose();

  const titles = {
    errors    : 'Game Over!',
    time      : 'Tempo scaduto! \u23F1\uFE0F',
    duplicate : 'Panino gi\u00E0 creato! \u{1F504}',
  };
  const descs = {
    errors    : 'Troppi ingredienti sbagliati! La prossima volta scegli pi\u00F9 attentamente! \u{1F4AA}',
    time      : 'Il tempo \u00E8 finito! Riprova e sii pi\u00F9 veloce! \u{1F3C3}',
    duplicate : 'Il panino non \u00E8 stato creato perch\u00E9 hai gi\u00E0 creato un panino cos\u00EC! Prova una combinazione diversa!',
  };

  DOM.lossTitle.textContent = titles[reason] || 'Game Over!';
  DOM.lossDesc.textContent  = descs[reason]  || '';
  DOM.lossScreen.removeAttribute('hidden');
}


/* ============================================================
   §14 CONFETTI
   ============================================================ */
function launchConfetti() {
  DOM.confetti.textContent = '';
  const cols   = ['#ffd600','#ff9800','#e53935','#43a047','#1565c0','#9c27b0','#f06292'];
  const shapes = ['\u25A0','\u25CF','\u25B2','\u2605','\u2666','\u2726'];

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
   §15 NAVIGAZIONE
   ============================================================ */
function startGame() {
  S.placed    = [];
  S.errors    = 0;
  S.animating = false;
  S.active    = true;

  updateDots();

  setFaceState('normal');
  DOM.child.classList.remove('happy', 'sad');
  DOM.child.classList.add('idle');
  DOM.childSpeech.setAttribute('hidden', '');

  for (let i = 1; i <= MAX_SLOTS; i++) {
    const slot = $(`slot-${i}`);
    slot.textContent = '';
    slot.className   = 'ingredient-slot';
  }

  buildGrid();

  [DOM.startScreen, DOM.winScreen, DOM.lossScreen].forEach(s => s.setAttribute('hidden', ''));
  DOM.gameScreen.removeAttribute('hidden');

  startTimer();
}


/* ============================================================
   §16 EVENT LISTENERS
   ============================================================ */

DOM.btnStart.addEventListener('click', startGame);

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

$('btn-replay-win').addEventListener('click', startGame);
$('btn-home-win').addEventListener('click',   () => { window.location.href = HOME_URL; });
$('btn-replay-loss').addEventListener('click', startGame);
$('btn-home-loss').addEventListener('click',   () => { window.location.href = HOME_URL; });

$('btn-about-close').addEventListener('click', () => {
  DOM.aboutPanel.setAttribute('hidden', '');
  DOM.aboutPanel.setAttribute('aria-hidden', 'true');
});

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