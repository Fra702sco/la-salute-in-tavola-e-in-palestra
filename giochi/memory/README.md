# 🃏 Memory degli Alimenti

> Gioco educativo a coppie sugli alimenti sani per bambini delle scuole primarie

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)
![Status](https://img.shields.io/badge/status-active-brightgreen)

---

## 🎮 Di cosa si tratta

**Memory degli Alimenti** è un gioco a coppie pensato per bambini delle scuole primarie.
L'obiettivo è scoprire tutte le coppie di carte raffiguranti alimenti sani, allenando la memoria
e imparando i nomi dei cibi. Sono disponibili **3 livelli di difficoltà** con un numero crescente di coppie.

---

## 📋 Regole

| Regola | Valore |
|---|---|
| Livello Facile | 6 coppie (12 carte) |
| Livello Medio | 8 coppie (16 carte) |
| Livello Difficile | 12 coppie (24 carte) |
| Obiettivo | Trovare tutte le coppie |
| Valutazione | 1–3 ⭐ in base a mosse e tempo |

---

## 🍽️ Alimenti presenti

| Emoji | Nome | Emoji | Nome |
|---|---|---|---|
| 🍎 | Mela | 🍌 | Banana |
| 🥕 | Carota | 🥦 | Broccoli |
| 🍇 | Uva | 🍊 | Arancia |
| 🍓 | Fragola | 🥑 | Avocado |
| 🌽 | Mais | 🥝 | Kiwi |
| 🍋 | Limone | 🫐 | Mirtilli |
| 🍅 | Pomodoro | 🥜 | Arachidi |
| 🧄 | Aglio | 🫒 | Olive |

> Ad ogni partita vengono selezionati casualmente N alimenti dalla lista completa.

---

## ✨ Funzionalità

- 🎲 **Selezione casuale** — ogni partita usa alimenti diversi estratti a random
- 🎴 **Animazione flip 3D** — le carte si girano con un effetto tridimensionale fluido
- ✨ **Shimmer sul retro** — effetto luce animata sulle carte non scoperte
- ✅ **Feedback visivo match** — verde con glow e animazione bounce sull'emoji
- ❌ **Feedback visivo errore** — shake rosso + flash prima di rigirare
- 🎉 **Confetti** — 110 coriandoli colorati all'animazione di vittoria
- ⭐ **Stelle** — valutazione 1–3 stelle in base a mosse e tempo impiegato
- 🏅 **Punteggio** — calcolato su mosse, tempo e difficoltà
- ⏱️ **Timer** — contatore tempo in tempo reale con urgenza visiva
- 👆 **Contatore mosse** — tiene traccia di ogni coppia girata
- 🌿 **Particelle emoji** — alimenti fluttuano animati sullo sfondo
- 🔊 **Effetti sonori** — flip, match, errore, vittoria (riutilizza audio del Quiz)
- 🎵 **Musica di sottofondo** — controllabile con il bottone 🔇/🔊
- 🏠 **Bottone Home con conferma** — modale per evitare uscite accidentali
- 🔄 **Riavvio rapido** — bottone per ricominciare in qualsiasi momento
- 📐 **Carte adattive** — si ridimensionano per stare in una sola pagina senza scroll
- ♿ **Accessibilità** — ARIA labels su ogni carta, `aria-live` sulle schermate risultato
- 📱 **Completamente responsive** — desktop, tablet e mobile

---

## 🚀 Come usarlo

### Metodo 1 — Diretto nel browser
1. Scarica o clona il repository
2. Apri `giochi/memory/index.html` nel browser — **nessun server necessario**

### Metodo 2 — GitHub Pages
👉 **https://fra702sco.github.io/la-salute-in-tavola-e-in-palestra/giochi/memory/**

---

## 📁 Struttura del progetto

```
giochi/memory/
├── index.html                              # HTML principale
├── README.md                               # Questo file
├── LICENSE                                 # Licenza CC BY-NC 4.0
└── assets/
    ├── css/
    │   └── style.css                       # Stili del gioco
    └── js/
        └── game.js                         # Logica del gioco
```

> 🔊 **Audio**: il gioco riutilizza i file audio del Quiz Alimentare da `../quiz/assets/audio/`.
> Non sono necessari file audio propri.

---

## 🏗️ Architettura del codice

### `game.js` — struttura interna

```
§0  CONFIG — 3 livelli (easy/medium/hard) con coppie, colonne e par time/mosse
§1  DATABASE ALIMENTI — 16 alimenti con emoji e nome
§2  STATO — difficulty, cards, flipped, matchedCount, moves, timer…
§3  DOM REFS — cache di tutti gli elementi
§4  AUDIO — playSound(), unlockAudio(), toggleMusic()
§5  PARTICELLE — emoji fluttuanti animate sullo sfondo
§6  TIMER — startTimer(), stopTimer(), fmtTime()
§7  SHUFFLE — Fisher-Yates shuffle
§8  BUILD GRIGLIA — buildGrid(), createCard() con stagger d'entrata
§9  LOGICA — onCardClick() → checkMatch() → match/errore
§10 VITTORIA — onWin(), calcStars(), calcScore()
§11 STELLE — revealStars() con animazione a cascata
§12 CONFETTI — spawnConfetti() con 110 pezzi
§13 SCHERMATE — showScreen()
§14 AVVIO/RIAVVIO — startGame(), restartGame()
§15 EVENT LISTENERS — difficoltà, start, home, restart, musica, modale
§16 INIT — buildParticles()
```

### `style.css` — struttura interna

```
Reset & variabili → Body → Particelle → Sistema schermate → Confetti →
Schermata iniziale (card, logo, difficoltà, regole, btn start) →
Game header (stats, ctrl buttons) →
Griglia di gioco (cols CSS class) →
Carta (back con shimmer, front con emoji+nome, flip 3D) →
Stati: matched (verde), wrong (shake rosso), entrata a cascata →
Schermata vittoria (trofeo, stelle, stats, pulsanti) →
Modale home → Responsive (≤600px, ≤390px)
```

---

## 🛠️ Tecnologie utilizzate

| Tecnologia | Utilizzo |
|---|---|
| **HTML5 semantico** | Struttura + accessibilità ARIA |
| **CSS3** | Animazioni 3D, glassmorphism, grid adattiva, shimmer |
| **JavaScript ES6+** | Logica memory, timer, audio, confetti, stelle |
| **CSS Custom Properties** | Colonne griglia dinamiche via JS (`--cols`, `--rows`) |
| **Web Audio API** | Effetti sonori e musica |

> Nessun framework, nessuna dipendenza esterna — tutto gira nel browser.

---

## ♿ Accessibilità

- `aria-label` su ogni carta (coperta / scoperta / abbinata)
- `aria-live="assertive"` sulla schermata di vittoria
- `role="grid"` + `role="gridcell"` sulla griglia di gioco
- `aria-modal` + `role="dialog"` su tutti i modali
- `aria-hidden="true"` su elementi decorativi (particelle, confetti)
- Navigazione da tastiera: `Enter` / `Spazio` per girare le carte, `ESC` per chiudere modali

---

## 📱 Compatibilità

| Piattaforma | Supporto |
|---|---|
| Desktop (Chrome, Firefox, Edge) | ✅ Completo |
| Desktop Safari / macOS | ✅ Completo |
| Tablet (touch) | ✅ Completo |
| Mobile (iOS / Android) | ✅ Completo |

---

## 👤 Autore

- **Ideazione, design e coordinamento**: Francesco Taccone ([@Fra702sco](https://github.com/Fra702sco))
- **Sviluppo del codice**: Realizzato con il supporto di **Claude Code(Anthropic)**

Progetto sviluppato durante il **Servizio Civile** 2025/2026 — comune di Nicotera (VV), Calabria.

> Il portale principale include: popup novità, navbar scroll-linked, SEO ottimizzato e Privacy Policy. Vedi il [README principale](../../README.md) per i dettagli.

---

## 📄 Licenza

**Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**

✅ Puoi usarlo, modificarlo e condividerlo liberamente
✅ Devi citare l'autore originale
❌ Non puoi usarlo per scopi commerciali

[![CC BY-NC 4.0](https://licensebuttons.net/l/by-nc/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc/4.0/)

---

*Fatto con ❤️ per i bambini di Nicotera*
