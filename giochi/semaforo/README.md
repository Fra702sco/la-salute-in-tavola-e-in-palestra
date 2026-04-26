# 🚦 Il Semaforo della Merenda

> Gioco educativo interattivo drag & drop per bambini sulla corretta alimentazione

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)
![Status](https://img.shields.io/badge/status-active-brightgreen)

---

## 🎮 Di cosa si tratta

**Il Semaforo della Merenda** è un gioco drag & drop pensato per bambini delle scuole primarie.
L'obiettivo è classificare correttamente 15 alimenti nei tre rettangoli colorati del semaforo,
imparando in modo divertente cosa è bene mangiare durante la merenda.

> ⚠️ Attenzione: hai solo **3 errori** a disposizione — al terzo errore la partita termina!

---

## 🍽️ Classificazione degli alimenti

| 🔴 Rosso — Da evitare | 🟡 Giallo — Con moderazione | 🟢 Verde — Consigliati |
|---|---|---|
| 🍟 Patatine        | 🍰 Torta fatta in casa     | 🍎 Mela    |
| 🍫 Cioccolato      | 🧃 Succo                   | 🥣 Yogurt  |
| 🥐 Brioche         | 🫓 Focaccia                | 🍌 Banana  |
| 🥤 Bibita          | 🥪 Panino                  | 🥕 Carota  |
| 🍬 Caramella       | 🍪 Biscotto fatto in casa  | 🥖 Pane    |

---

## ✨ Funzionalità

- 🖥️ **Schermata iniziale** con regole del gioco, avviso 3 errori e pulsante "Inizia a giocare!"
- 🔙 **Pulsante Annulla** nella schermata iniziale per tornare alla homepage senza conferma
- 🖱️ **Drag & Drop** fluido con SortableJS (compatibile mouse, touch screen e tablet) — libreria servita in locale, nessuna dipendenza da CDN esterni
- 👻 **Ghost manuale personalizzato** — elemento rimpicciolito che segue il cursore/dito
- 🚦 **Semaforo animato** — si illumina di verde se corretto, rosso se sbagliato
- 📳 **Toast banner mobile** — notifica animata con immagine semaforo da sinistra su smartphone
- 🎵 **Musica di sottofondo** — controllabile con bottone 🎵 e slider volume
- 🔊 **Effetti sonori** — suono diverso per risposta corretta, sbagliata, vittoria e game over
- 🎊 **Schermata successo** con coriandoli animati (120 pezzi)
- 💀 **Schermata game over** — appare al terzo errore con suono dedicato
- ❤️ **Indicatore errori** — 3 pallini rossi che si accendono ad ogni errore
- 🏠 **Bottone Home con conferma** — modale "Sei sicuro di voler uscire?" per evitare uscite accidentali
- 🎯 **Calibrazione luci semaforo** — accessibile tramite scorciatoia da tastiera
- 💾 **Salvataggio automatico** delle impostazioni di calibrazione nel localStorage
- ♿ **Accessibilità** — ARIA completo su pannelli, zone di drop, status e toast
- 🔄 **Reset** per ricominciare da zero in qualsiasi momento

---

## 🚀 Come usarlo

### Metodo 1 — Diretto nel browser
1. Scarica o clona il repository
2. Apri `giochi/semaforo/index.html` nel browser — **nessun server necessario**

### Metodo 2 — GitHub Pages
👉 **https://fra702sco.github.io/la-salute-in-tavola-e-in-palestra/giochi/semaforo/**

---

## 🎯 Calibrazione luci semaforo

I pannelli di calibrazione sono **nascosti** all'utente finale e accessibili
solo tramite scorciatoie da tastiera — i bambini non possono modificare accidentalmente le impostazioni.

### ⌨️ Scorciatoie da tastiera

| Azione | Windows / Linux | macOS |
|---|---|---|
| Apri/chiudi **Coordinate** | `Ctrl + Shift + 8` | `Cmd + 8` |
| Avvia/annulla **Calibratore** | `Ctrl + Shift + 9` | `Cmd + 9` |
| Annulla / chiudi pannelli | `ESC` | `ESC` |

### Procedura di calibrazione
1. Premi `Ctrl+Shift+9` (o `Cmd+9` su macOS)
2. Il cursore diventa una croce — clicca sul **centro del bulbo rosso**
3. Clicca sul **centro del bulbo giallo**
4. Clicca sul **centro del bulbo verde**
5. Le coordinate vengono **salvate automaticamente** nel browser

---

## 📁 Struttura del progetto

```
giochi/semaforo/
├── index.html                              # HTML principale
├── README.md                               # Questo file
├── LICENSE                                 # Licenza CC BY-NC 4.0
└── assets/
    ├── css/
    │   └── style.css                       # Stili del gioco
    ├── js/
    │   ├── game.js                         # Logica del gioco
    │   └── Sortable.min.js                 # SortableJS 1.15 (locale, no CDN)
    ├── audio/
    │   ├── background.mp3                  # Musica di sottofondo (loop)
    │   ├── correct.mp3                     # Suono risposta corretta
    │   ├── error.mp3                       # Suono risposta sbagliata
    │   ├── victory.mp3                     # Fanfara di vittoria
    │   └── loss.mp3                        # Suono game over
    └── image/
        ├── background/
        │   ├── background.jpg              # Sfondo desktop
        │   └── background-mobile.png       # Sfondo mobile
        └── (mobile)pop-up/
            ├── semaforo-verde.png          # Immagine toast risposta corretta
            └── semaforo-rosso.png          # Immagine toast risposta sbagliata
```

---

## 🏗️ Architettura del codice

### `game.js` — struttura interna

```
DOMContentLoaded
 ├── §0  Costanti alimenti (15 items con zona corretta)
 ├── §1  Stato gioco (contatori, flag, timer)
 ├── §2  Cache DOM
 ├── §3  Audio (playSound, toggleBgMusic, unlockAudio)
 ├── §4  Glow semaforo (positionGlows su coordinate localStorage)
 ├── §5  Pannello Settings (openSettings, closeSettings)
 ├── §6  Calibrazione (startCalib, stopCalib, showCalibStep)
 ├── §7  Pannello About (openAbout, closeAbout)
 ├── §8  Keyboard shortcuts (ESC, Ctrl+Shift+8/9)
 ├── §9  Confetti (120 pezzi colorati)
 ├── §10 Toast banner mobile (con immagine semaforo)
 ├── §11 Semaforo feedback (setTraffic: verde/rosso)
 ├── §12 Indicatore errori (updateErrorDots)
 ├── §13 Game Over / Successo (triggerGameOver, checkSuccess)
 ├── §14 Stato item (updateItemStatus: pulse/shake)
 ├── §15 Drag & Drop (handleDrop, Sortable, dragover)
 ├── §16 Ghost touch/mouse (createGhost, moveGhost, removeGhost)
 ├── §17 Build/Reset gioco (createItem, buildItems, resetGame)
 ├── §18 Bottoni (reset, retry, play-again, start, confirm-home)
 └── §19 Init → buildItems()
```

### `style.css` — struttura interna

```
Reset → Body → Glow → Schermata iniziale (+ btn Annulla) →
Success → Gameover → Conferma Home → Confetti → Toast →
Calibrazione → Settings → About →
Controlli desktop → Area gioco → Item →
Sortable/Ghost → Responsive (tablet → mobile)
```

---

## 🔊 Credits audio

| File | Fonte | Licenza |
|---|---|---|
| `correct.mp3`    | [Pixabay](https://pixabay.com) | Free — no attribution required |
| `error.mp3`      | [Pixabay](https://pixabay.com) | Free — no attribution required |
| `victory.mp3`    | [Mixkit](https://mixkit.co)   | Free — no attribution required |
| `loss.mp3`       | [Pixabay](https://pixabay.com) | Free — no attribution required |
| `background.mp3` | [Uppbeat](https://uppbeat.io) | Free Tier — credit obbligatorio |

---

## 🛠️ Tecnologie utilizzate

| Tecnologia | Utilizzo |
|---|---|
| **HTML5 semantico** | Struttura + accessibilità ARIA completa |
| **CSS3** | Animazioni, layout, glow, clip-path toast, media queries |
| **JavaScript ES6+** | Logica, ghost, audio, calibrazione, localStorage, debounce resize |
| **[SortableJS 1.15](https://sortablejs.github.io/Sortable/)** | Drag & drop degli alimenti — **bundled in locale** (`assets/js/Sortable.min.js`) |
| **Web Audio API** | Effetti sonori e musica di sottofondo |
| **localStorage** | Salvataggio impostazioni di calibrazione (con wrapper `try/catch` anti-quota/private mode) |

> Nessun framework, nessuna dipendenza backend — tutto gira nel browser.

---

## ♿ Accessibilità

- `role="dialog"` + `aria-modal` + `aria-labelledby` su tutti i pannelli
- `aria-hidden="true"` su pannelli chiusi e elementi decorativi
- `role="list"` + `aria-label` sulle dropzone e sulla zona alimenti
- `role="status"` + `aria-live="polite"` su status bar e toast banner
- `<main>` come elemento semantico dell'area di gioco
- `<nav>` per la barra di controlli mobile
- `aria-label` su tutti i bottoni icon-only

---

## 📱 Compatibilità

| Piattaforma | Supporto |
|---|---|
| Desktop (Chrome, Firefox, Edge) | ✅ Completo |
| Desktop Safari / macOS | ✅ Completo |
| Tablet (touch) | ✅ Completo |
| Mobile (iOS / Android) | ✅ Completo con toast semaforo animato |

---

## 👤 Autore

- **Ideazione, design e coordinamento**: Francesco Taccone ([@Fra702sco](https://github.com/Fra702sco))
- **Sviluppo del codice**: Realizzato con il supporto di **Perplexity AI** e **Claude Code (Anthropic)**

Progetto sviluppato durante il **Servizio Civile Universale** 2025/2026 — Comune di Nicotera (VV), Calabria.

> Il portale principale include: popup novità, navbar scroll-linked, SEO ottimizzato e Privacy Policy GDPR-compliant. Vedi il [README principale](../../README.md) per i dettagli.
> Altri giochi disponibili: [🧠 Quiz Alimentare](../quiz/README.md) · [🃏 Memory degli Alimenti](../memory/README.md) · 🔺 Puzzle della Piramide · 🥪 Il Panino Perfetto

---

## 📄 Licenza

**Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**

✅ Puoi usarlo, modificarlo e condividerlo liberamente
✅ Devi citare l'autore originale
❌ Non puoi usarlo per scopi commerciali

[![CC BY-NC 4.0](https://licensebuttons.net/l/by-nc/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc/4.0/)

---

*Fatto con ❤️ per i bambini di Nicotera*
