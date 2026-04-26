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
| 🧠 **Quiz Alimentare** | ✅ Disponibile | 70+ domande su nutrizione, sport e vitamine + riepilogo errori finale |
| 🃏 **Memory degli Alimenti** | ✅ Disponibile | 3 livelli di difficoltà — trova le coppie di alimenti sani |
| 🔺 **Puzzle della Piramide** | ✅ Disponibile | Costruisci la piramide alimentare trascinando gli alimenti |

---

## ✨ Funzionalità del portale

- 🎨 **Design animato** — hero con bolle fluttuanti, animazioni di entrata su scroll (reveal)
- 📱 **Completamente responsive** — ottimizzato per desktop, tablet e smartphone (iOS/Android)
- 🧭 **Navbar scroll-linked** — si scurisce proporzionalmente allo scroll (da blu vivace a quasi nero), con altezza che si comprime; hamburger menu su mobile
- 🆕 **Popup novità** — modale che appare al primo accesso (o al cambio versione) con le ultime novità del sito; chiudibile con ✕, click fuori o `Escape`
- 📊 **Sezione statistiche** — contatori animati (giochi, gratuito, no pub, contenuti)
- 🥦 **Sezione alimentazione** — 4 card sui benefici di mangiare sano
- 🏃 **Sezione sport** — 6 card con barre animate; emoji 🏃 decorativa animata con effetto corsa (bounce + rotazione)
- 👩‍🏫 **Sezione insegnanti e genitori** — informazioni sul progetto
- 📲 **Link social** — Facebook e Instagram del progetto
- ✉️ **Form contatti** — invio via **Formspree** con: validazione email, honeypot anti-bot (`_gotcha`), rate-limit 5s tra invii, `maxlength` sui campi e selezione del ruolo (genitore/insegnante/educatore) per la conformità Art. 8 GDPR
- 🛡️ **Logo Servizio Civile Universale** nell'hero — credit istituzionale del Comune di Nicotera
- 🌀 **Scroll personalizzato** — animazione smooth con easing su click navbar (900ms)
- 🔒 **Privacy Policy GDPR-compliant** — modale dal footer con: Titolare (Comune di Nicotera), DPO (Asmenet Calabria S.C.A.R.L.), base giuridica unica (consenso Art. 6.1.a), 7 diritti completi, reclamo Garante, procedura data breach, conservazione 24 mesi, qualifica Formspree come responsabile ex Art. 28 GDPR + DPF/SCC per trasferimento extra-UE
- ⚖️ **Note Legali** — modale dal footer con disclaimer educativo/medico (i contenuti non sostituiscono consulenza medica/nutrizionale/sportiva), limitazione di responsabilità, comportamento accettabile, foro competente (Vibo Valentia), licenza CC BY-NC 4.0
- 🛡️ **Disclosure responsabile** — file [`/.well-known/security.txt`](./.well-known/security.txt) ([RFC 9116](https://datatracker.ietf.org/doc/html/rfc9116)) per la segnalazione di vulnerabilità da parte di ricercatori di sicurezza
- 🔍 **SEO ottimizzato** — title/description con keyword, canonical, geo tag, Open Graph completo, Twitter Card, JSON-LD strutturato (WebSite, EducationalOrganization, ItemList giochi)
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
├── .gitignore                              # Esclusioni (binari, segreti, OS)
├── .nojekyll                               # Disabilita Jekyll su GitHub Pages
├── robots.txt                              # Direttive crawler
├── sitemap.xml                             # Sitemap SEO
│
├── .well-known/
│   └── security.txt                        # Vulnerability disclosure (RFC 9116)
│
├── assets/
│   ├── css/
│   │   └── style.css                       # CSS homepage
│   ├── js/
│   │   └── script.js                       # JS homepage (navbar, form, reveal, safeStorage)
│   └── ico-preview/
│       ├── favicon.ico                     # Icona del sito
│       ├── favicon-16x16.png · favicon-32x32.png
│       ├── apple-touch-icon.png
│       ├── android-chrome-192x192.png · android-chrome-512x512.png
│       ├── site.webmanifest                # PWA manifest
│       ├── preview.jpg                     # Immagine Open Graph (social/WhatsApp)
│       └── servizio-civile.png             # Logo Servizio Civile Universale (hero credit)
│
└── giochi/
    │
    ├── semaforo/                           # ✅ Drag & drop alimenti
    │   ├── index.html · README.md · LICENSE
    │   └── assets/
    │       ├── css/style.css
    │       ├── js/game.js
    │       ├── js/Sortable.min.js          # SortableJS in locale (no CDN)
    │       ├── audio/ (background, correct, error, victory, loss)
    │       └── image/background + (mobile)pop-up
    │
    ├── quiz/                               # ✅ 70+ domande
    │   ├── index.html · README.md · LICENSE
    │   └── assets/
    │       ├── css/style.css
    │       ├── js/quiz.js
    │       ├── domande-risposte/domande.json
    │       └── audio/ (background, correct, error, victory, loss, tick)
    │
    ├── memory/                             # ✅ Memory a coppie (3 livelli)
    │   ├── index.html · README.md · LICENSE
    │   └── assets/css + js
    │   # Riusa l'audio del Quiz
    │
    └── piramide/                           # ✅ Puzzle piramide alimentare
        ├── index.html
        └── assets/css + js
```

---

## 🏗️ Architettura del codice

### `assets/js/script.js`

```
safeStorage — wrapper try/catch per localStorage (privacy mode, quota, iframe)

IIFE (esecuzione immediata)
 └── Popup novità — mostra se versione localStorage ≠ WHATS_NEW_VERSION

DOMContentLoaded
 ├── Navbar — hamburger (apri/chiudi + chiudi su click link)
 ├── Navbar — scroll-linked (lerp colore/ombra/altezza su ogni evento scroll)
 ├── Navbar — link attivo per sezione visibile (IntersectionObserver)
 ├── Navbar — scroll personalizzato easeInOutQuad (900ms)
 ├── Barre sport — animazione riempimento (IntersectionObserver)
 ├── Reveal on scroll (IntersectionObserver + fallback)
 ├── Validazione email — TLD permissivo + blocco domini temporanei/fake
 ├── Form contatti — invio async via Formspree con:
 │    ├── Honeypot _gotcha (drop silenzioso se valorizzato)
 │    ├── Rate-limit 5 secondi tra invii consecutivi
 │    ├── Validazione ruolo (Art. 8 GDPR — filtro soft minori)
 │    ├── Validazione consenso (Art. 6.1.a GDPR)
 │    └── Feedback successo/errore + disable bottone durante invio
 ├── Privacy Policy modal — apri/chiudi dal footer + stopPropagation sul link
 │                          consenso per evitare toggle accidentale del checkbox
 └── Note Legali modal — apri/chiudi dal footer (disclaimer + limitazioni)
```

### `assets/css/style.css`

```
Reset → Variabili CSS → Global → Navbar (scroll-linked) →
Hero → Stats → Section header → Giochi →
Educazione → Insegnanti → Sport (animazione 🏃) → Social →
Contatti → Footer → Popup novità → Privacy Policy modal →
Reveal on scroll → Responsive (≤ 900px → ≤ 768px → ≤ 600px)
```

---

## 🛠️ Tecnologie utilizzate

| Tecnologia | Utilizzo |
|---|---|
| **HTML5 semantico** | Struttura portale e giochi + ARIA completo |
| **CSS3** | Animazioni, glassmorphism, reveal on scroll, media queries |
| **JavaScript ES6+** | Navbar, scroll custom, form, IntersectionObserver |
| **[SortableJS 1.15](https://sortablejs.github.io/Sortable/)** | Drag & drop nel gioco Semaforo — **servito in locale** (no dipendenze CDN) |
| **Web Audio API** | Effetti sonori e musica nei giochi |
| **IntersectionObserver API** | Animazioni di entrata su scroll e link attivo navbar |
| **localStorage** | Popup novità + calibrazione semaforo — wrappati in `safeStorage` (try/catch anti-quota / private mode) |
| **Fetch API** | Caricamento domande da file JSON esterno (quiz) |
| **[Formspree](https://formspree.io)** | Ricezione form contatti — qualificato come responsabile esterno ex Art. 28 GDPR |
| **Content Security Policy** | CSP restrittiva su tutte le pagine (`default-src 'none'`) + `Referrer-Policy: strict-origin-when-cross-origin` |

> Nessun framework, nessuna dipendenza backend — tutto gira nel browser.

---

## 🔍 SEO

Il portale è ottimizzato per i motori di ricerca con:

- **Title e description** con keyword mirate (alimentazione bambini, scuola primaria, Nicotera)
- **`<link rel="canonical">`** per evitare contenuto duplicato
- **Geo tag** (`geo.region`, `geo.placename`, `geo.position`) per SEO locale
- **Open Graph completo** — anteprima ricca su WhatsApp, Facebook, LinkedIn
- **Twitter Card** `summary_large_image`
- **JSON-LD strutturato** — `WebSite`, `EducationalOrganization`, `WebPage`, `ItemList` giochi
- **Google Search Console** configurata (verifica presente nel `<head>`)

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

## 👤 Autore e titolarità

**La Salute a Tavola e in Palestra** è un progetto educativo interattivo realizzato
durante il **Servizio Civile Universale 2025/2026** presso il **Comune di Nicotera (VV)**, Calabria 🇮🇹

- **Titolare del trattamento dati** (GDPR): Comune di Nicotera — PEC `protocollo.nicotera@asmepec.it`
- **DPO/RPD**: Asmenet Calabria S.C.A.R.L. — PEC `asmenetcalabria@asmepec.it`
- **Ideazione, design e sviluppo**: Francesco Taccone ([@Fra702sco](https://github.com/Fra702sco))
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

Copyright © 2026 **Comune di Nicotera** (titolare) e **Francesco Taccone** (autore).

✅ Puoi usarlo, modificarlo e condividerlo liberamente
✅ Devi citare gli autori originali
❌ Non puoi usarlo per scopi commerciali

[![CC BY-NC 4.0](https://licensebuttons.net/l/by-nc/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc/4.0/)

---

*Fatto con ❤️ per i bambini di Nicotera*
