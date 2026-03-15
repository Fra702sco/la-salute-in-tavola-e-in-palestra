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
| 🧠 **Quiz Alimentare** | 🔵 In arrivo | Rispondi a domande sulla nutrizione |
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
- ✉️ **Form contatti** — apre il client email con oggetto e messaggio precompilati
- 🌀 **Scroll personalizzato** — animazione smooth con easing su click navbar (900ms)
- 🚫 **Zero pubblicità**, zero registrazione, zero tracking

---

## 🚀 Come usarlo

### Metodo 1 — Diretto nel browser
1. Scarica o clona il repository
2. Apri `index.html` nel browser — **nessun server necessario**

### Metodo 2 — Clona con Git
```bash
git clone https://github.com/Fra702sco/la-salute-a-tavola.git
cd la-salute-a-tavola
# Apri index.html nel browser
```

### Metodo 3 — GitHub Pages
Il portale è disponibile online all'indirizzo:  
👉 **[https://fra702sco.github.io/la-salute-a-tavola](https://fra702sco.github.io/la-salute-a-tavola)**

---

## 📁 Struttura del progetto

```
la-salute-a-tavola/
│
├── index.html                        # Homepage principale
├── favicon.ico                       # Icona del sito
├── preview.jpg                       # Immagine Open Graph (WhatsApp/social)
├── README.md                         # Questo file
├── LICENSE                           # Licenza CC BY-NC 4.0
│
├── assets/
│   ├── css/
│   │   └── style.css                 # CSS globale homepage
│   └── js/
│       └── script.js                 # JS globale homepage
│
└── giochi/
    │
    ├── semaforo/                     # ✅ Disponibile
    │   ├── index.html                # Gioco completo (single file)
    │   └── assets/
    │       ├── audio/
    │       │   ├── background.mp3    # Musica di sottofondo
    │       │   ├── correct.mp3       # Suono risposta corretta
    │       │   ├── error.mp3         # Suono risposta sbagliata
    │       │   └── victory.mp3       # Fanfara di vittoria
    │       └── image/
    │           ├── background/
    │           │   ├── background.jpg
    │           │   └── background-mobile.png
    │           └── mobile/pop-ups/
    │               ├── semaforo-verde.png
    │               └── semaforo-rosso.png
    │
    ├── quiz/                         # 🔵 In arrivo
    │   ├── index.html
    │   └── assets/
    │       ├── audio/
    │       └── image/
    │
    ├── memory/                       # 🟠 In arrivo
    │   ├── index.html
    │   └── assets/
    │       ├── audio/
    │       └── image/
    │
    └── puzzle/                       # 🟣 In arrivo
        ├── index.html
        └── assets/
            ├── audio/
            └── image/
```

---

## 🛠️ Tecnologie utilizzate

| Tecnologia | Utilizzo |
|---|---|
| **HTML5** | Struttura del portale e dei giochi |
| **CSS3** | Animazioni, layout, glassmorphism, reveal on scroll |
| **JavaScript (ES6+)** | Navbar, scroll personalizzato, form contatti, reveal observer |
| **[SortableJS 1.15](https://sortablejs.github.io/Sortable/)** | Drag & drop nel gioco Semaforo |
| **Web Audio API** | Effetti sonori e musica nei giochi |
| **IntersectionObserver API** | Animazioni di entrata su scroll |
| **localStorage** | Salvataggio impostazioni calibrazione semaforo |

> Nessun framework, nessuna dipendenza backend — tutto gira nel browser.

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

L'obiettivo è sensibilizzare i bambini a fare scelte consapevoli
riguardo all'alimentazione quotidiana e all'importanza del movimento,
attraverso giochi interattivi accessibili a tutti.

---

## 📲 Social del progetto

- 📘 **Facebook**: [Servizio Civile Nicotera 2025](https://www.facebook.com/profile.php?id=61581125656677)
- 📸 **Instagram**: [@serviziocivilenicotera_2025](https://www.instagram.com/serviziocivilenicotera_2025/)
- ✉️ **Email**: serviziocivilenicotera2025@outlook.com

---

## 👤 Autore

**La Salute a Tavola e in Palestra** è un progetto educativo interattivo realizzato
durante il Servizio Civile 2025/2026 presso il comune di Nicotera (VV), Calabria 🇮🇹

- **Ideazione, design e coordinamento**: Francesco Taccone ([@Fra702sco](https://github.com/Fra702sco))
- **Sviluppo del codice**: Realizzato con il supporto di **Perplexity AI**

### 🤝 Ringraziamenti
- [Perplexity AI](https://perplexity.ai) — Supporto allo sviluppo del codice
- [SortableJS](https://sortablejs.github.io/Sortable/) — Libreria drag & drop
- [Mixkit](https://mixkit.co) — Effetti sonori gratuiti
- [Uppbeat](https://uppbeat.io) — Musica di sottofondo

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
