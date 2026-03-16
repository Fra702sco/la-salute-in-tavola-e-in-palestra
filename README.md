# 🥗 La Salute a Tavola e in Palestra

> Portale educativo interattivo sulla salute, alimentazione e sport per bambini delle scuole primarie

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)
![Status](https://img.shields.io/badge/status-active-brightgreen)

---

## 🌐 Di cosa si tratta

**La Salute a Tavola e in Palestra** è un portale web educativo pensato per i bambini
delle scuole primarie del comune di **Nicotera (VV), Calabria**.

Il progetto combina giochi interattivi, contenuti educativi sull'alimentazione sana
e sull'attività fisica, con un design colorato e accessibile anche da tablet e smartphone.
Tutto è gratuito, senza pubblicità e senza registrazione.

---

## 🎮 Giochi disponibili

| Gioco | Stato | Descrizione |
|---|---|---|
| 🚦 **Il Semaforo della Merenda** | ✅ Disponibile | Drag & drop — classifica 15 alimenti nel semaforo |
| 🧠 **Quiz Alimentare** | ✅ Disponibile | 70+ domande su nutrizione, sport e vitamine |
| 🃏 **Memory degli Alimenti** | 🟠 In arrivo | Trova le coppie di alimenti sani |
| 🧩 **Puzzle della Piramide** | 🟣 In arrivo | Componi la piramide alimentare |

---

## ✨ Funzionalità del portale

- 🎨 **Design animato** — hero con bolle fluttuanti, animazioni di entrata su scroll (reveal)
- 📱 **Completamente responsive** — ottimizzato per desktop, tablet e smartphone
- 🧭 **Navbar sticky** con hamburger menu su mobile e link attivo per sezione visibile
- 📊 **Sezione statistiche** — contatori animati (giochi, gratuito, no pub, contenuti)
- 🥦 **Sezione alimentazione** — 4 card sui benefici di mangiare sano
- 🏃 **Sezione sport** — 6 card con barre animate sui benefici dell'attività fisica
- 👩‍🏫 **Sezione insegnanti e genitori** — informazioni sul progetto
- 📲 **Link social** — Facebook e Instagram del progetto
- ✉️ **Form contatti** — invio diretto via **Formspree** con validazione email (blocco domini temporanei)
- 🌀 **Scroll personalizzato** — animazione smooth con easing su click navbar (900ms)
- ♿ **Accessibilità** — HTML semantico, ARIA completo, `aria-live` su feedback dinamici
- 🚫 **Zero pubblicità**, zero registrazione, zero tracking

---

## 🚀 Come usarlo

### Metodo 1 — Diretto nel browser
1. Scarica o clona il repository
2. Apri `index.html` nel browser — **nessun server necessario**

> ⚠️ Il Quiz Alimentare usa `fetch()` per caricare le domande. Aprilo tramite un server locale oppure via GitHub Pages per il corretto funzionamento.

### Metodo 2 — Clona con Git
```bash
git clone https://github.com/Fra702sco/la-salute-in-tavola-e-in-palestra.git
cd la-salute-in-tavola-e-in-palestra
```
Apri `index.html` nel browser.

### Metodo 3 — GitHub Pages
Il portale è disponibile online all'indirizzo:
👉 **https://fra702sco.github.io/la-salute-in-tavola-e-in-palestra**

---

## 📁 Struttura del progetto

```
la-salute-in-tavola-e-in-palestra/
│
├── index.html                              # Homepage principale
├── README.md                               # Questo file
├── LICENSE                                 # Licenza CC BY-NC 4.0
│
├── assets/
│   ├── css/
│   │   └── style.css                       # CSS homepage
│   ├── js/
│   │   └── script.js                       # JS homepage (navbar, form, reveal)
│   └── ico-preview/
│       ├── favicon.ico                     # Icona del sito
│       └── preview.jpg                     # Immagine Open Graph (social/WhatsApp)
│
└── giochi/
    │
    ├── semaforo/                           # ✅ Disponibile
    │   ├── index.html
    │   ├── README.md
    │   └── assets/
    │       ├── css/style.css
    │       ├── js/game.js
    │       ├── audio/
    │       │   ├── background.mp3
    │       │   ├── correct.mp3
    │       │   ├── error.mp3
    │       │   ├── victory.mp3
    │       │   └── loss.mp3
    │       └── image/
    │           ├── background/
    │           │   ├── background.jpg
    │           │   └── background-mobile.png
    │           └── (mobile)pop-up/
    │               ├── semaforo-verde.png
    │               └── semaforo-rosso.png
    │
    └── quiz/                               # ✅ Disponibile
        ├── index.html
        ├── README.md
        └── assets/
            ├── css/style.css
            ├── js/quiz.js
            ├── domande-risposte/
            │   └── domande.json            # Banca dati domande + categorie
            └── audio/
                ├── background.mp3
                ├── correct.mp3
                ├── error.mp3
                ├── victory.mp3
                ├── loss.mp3
                └── tick.mp3
```

---

## 🏗️ Architettura del codice

### `assets/js/script.js`

```
DOMContentLoaded
 ├── Navbar — hamburger (apri/chiudi + chiudi su click link)
 ├── Navbar — scura allo scroll
 ├── Navbar — link attivo per sezione visibile (IntersectionObserver)
 ├── Navbar — scroll personalizzato easeInOutQuad (900ms)
 ├── Barre sport — animazione riempimento (IntersectionObserver)
 ├── Reveal on scroll (IntersectionObserver + fallback)
 ├── Validazione email — blocco domini temporanei/falsi (300+ domini)
 └── Form contatti — invio async via Formspree con feedback successo/errore
```

### `assets/css/style.css`

```
Reset → Variabili CSS → Global → Navbar →
Hero → Stats → Section header → Giochi →
Educazione → Insegnanti → Sport → Social →
Contatti → Footer → Reveal on scroll →
Responsive (≤ 900px → ≤ 768px → ≤ 600px)
```

---

## 🛠️ Tecnologie utilizzate

| Tecnologia | Utilizzo |
|---|---|
| **HTML5 semantico** | Struttura portale e giochi + ARIA completo |
| **CSS3** | Animazioni, glassmorphism, reveal on scroll, media queries |
| **JavaScript ES6+** | Navbar, scroll custom, form, IntersectionObserver |
| **[SortableJS 1.15](https://sortablejs.github.io/Sortable/)** | Drag & drop nel gioco Semaforo |
| **Web Audio API** | Effetti sonori e musica nei giochi |
| **IntersectionObserver API** | Animazioni di entrata su scroll e link attivo navbar |
| **localStorage** | Salvataggio impostazioni calibrazione semaforo |
| **Fetch API** | Caricamento domande da file JSON esterno (quiz) |
| **[Formspree](https://formspree.io)** | Ricezione messaggi del form contatti senza backend |

> Nessun framework, nessuna dipendenza backend — tutto gira nel browser.

---

## ♿ Accessibilità

Il portale e i giochi rispettano le linee guida WCAG 2.1:

- HTML semantico (`<main>`, `<nav>`, `<section>`, `<footer>`)
- `aria-hidden="true"` su tutti gli elementi decorativi (emoji, SVG, bolle)
- `aria-label` su bottoni icon-only e link social
- `aria-expanded` + `aria-controls` sull'hamburger navbar
- `aria-live="polite"` sul feedback del form contatti e dei giochi
- `role="dialog"` + `aria-modal` + `aria-labelledby` sui pannelli dei giochi
- `role="list"` + `aria-label` sulle zone di drop e zona alimenti (Semaforo)
- `role="status"` + `aria-live` su timer e feedback risposta (Quiz)

---

## 📱 Compatibilità

| Piattaforma | Supporto |
|---|---|
| Desktop (Chrome, Firefox, Edge) | ✅ Completo |
| Desktop Safari / macOS | ✅ Completo |
| Tablet (touch) | ✅ Completo |
| Mobile (iOS / Android) | ✅ Completo |

---

## 📚 Contesto didattico

Progetto realizzato nell'ambito del programma **"La Salute a Tavola e in Palestra"**,
un percorso di educazione alimentare e motoria rivolto agli studenti delle scuole primarie
del comune di **Nicotera (VV), Calabria**.

L'obiettivo è sensibilizzare i bambini a fare scelte consapevoli riguardo all'alimentazione
quotidiana e all'importanza del movimento, attraverso giochi interattivi accessibili a tutti.

---

## 📲 Social del progetto

- 📘 **Facebook**: [Servizio Civile Nicotera 2025](https://www.facebook.com/profile.php?id=61581125656677)
- 📸 **Instagram**: [@serviziocivilenicotera_2025](https://www.instagram.com/serviziocivilenicotera_2025/)
- ✉️ **Email**: [serviziocivilenicotera2025@outlook.com](mailto:serviziocivilenicotera2025@outlook.com)

---

## 👤 Autore

**La Salute a Tavola e in Palestra** è un progetto educativo interattivo realizzato
durante il Servizio Civile 2025/2026 presso il comune di Nicotera (VV), Calabria 🇮🇹

- **Ideazione, design e coordinamento**: Francesco Taccone ([@Fra702sco](https://github.com/Fra702sco))
- **Sviluppo del codice**: Realizzato con il supporto di **Perplexity AI** e **Claude Code (Anthropic)**

### 🤝 Ringraziamenti
- [Perplexity AI](https://perplexity.ai) — Supporto allo sviluppo del codice
- [Claude Code](https://claude.ai) — Supporto allo sviluppo, refactoring e correzioni
- [SortableJS](https://sortablejs.github.io/Sortable/) — Libreria drag & drop
- [Formspree](https://formspree.io) — Servizio form senza backend
- [Mixkit](https://mixkit.co) — Effetti sonori gratuiti
- [Uppbeat](https://uppbeat.io) — Musica di sottofondo
- [Pixabay](https://pixabay.com) — Effetti sonori gratuiti

---

## 📄 Licenza

Questo progetto è distribuito sotto licenza
**Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.

✅ Puoi usarlo, modificarlo e condividerlo liberamente
✅ Devi citare l'autore originale
❌ Non puoi usarlo per scopi commerciali

[![CC BY-NC 4.0](https://licensebuttons.net/l/by-nc/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc/4.0/)

---

*Fatto con ❤️ per i bambini di Nicotera*
