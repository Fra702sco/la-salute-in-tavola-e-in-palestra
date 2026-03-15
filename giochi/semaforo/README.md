# 🚦 Il Semaforo della Merenda

> Gioco educativo interattivo per bambini sulla corretta alimentazione

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

---

## 🍽️ Classificazione degli alimenti

| 🔴 Rosso — Da evitare | 🟡 Giallo — Con moderazione | 🟢 Verde — Consigliati |
|---|---|---|
| 🍟 Patatine | 🍰 Torta fatta in casa | 🍎 Mela |
| 🍫 Cioccolato | 🧃 Succo | 🥣 Yogurt |
| 🥐 Brioche | 🫓 Focaccia | 🍌 Banana |
| 🥤 Bibita | 🥪 Panino | 🥕 Carota |
| 🍬 Caramella | 🍪 Biscotto fatto in casa | 🥖 Pane |

---

## ✨ Funzionalità

- 🖥️ **Schermata iniziale** con regole del gioco e pulsante "Inizia a giocare!" animato
- 🖱️ **Drag & Drop** fluido con SortableJS (compatibile mouse, touch screen e tablet)
- 👻 **Ghost manuale personalizzato** — elemento rimpicciolito che segue il cursore/dito senza inclinazione
- 🚦 **Semaforo animato** — si illumina di verde se corretto, rosso se sbagliato
- 📳 **Toast banner mobile** — notifica visiva animata con immagine del semaforo (verde/rosso) che appare da sinistra su smartphone
- 🎵 **Musica di sottofondo** — si avvia automaticamente al click su "Inizia a giocare!", controllabile con bottone 🎵
- 🔊 **Effetti sonori** — suono diverso per risposta corretta, sbagliata e vittoria finale
- 🏆 **Suono di vittoria** — fanfara al completamento di tutti gli alimenti
- 🎊 **Schermata di successo** con coriandoli animati al completamento
- 🎯 **Calibrazione luci** — accessibile solo tramite scorciatoia da tastiera (nascosta agli utenti)
- ⚙️ **Pannello coordinate** — accessibile solo tramite scorciatoia da tastiera (nascosta agli utenti)
- 💾 **Salvataggio automatico** delle impostazioni di calibrazione nel localStorage
- 🔄 **Reset** per ricominciare da zero

---

## 🚀 Come usarlo

### Metodo 1 — Diretto nel browser
1. Scarica o clona il repository
2. Apri `index.html` nel browser — **nessun server necessario**

### Metodo 2 — Clona con Git
```bash
git clone https://github.com/Fra702sco/semaforo-della-merenda.git
cd semaforo-della-merenda
Apri index.html nel browser
```

### Metodo 3 — GitHub Pages
Il gioco è disponibile online all'indirizzo:  
👉 **[https://fra702sco.github.io/semaforo-della-merenda](https://fra702sco.github.io/semaforo-della-merenda)**

---

## 🎯 Come calibrare le luci del semaforo

I pannelli di calibrazione e coordinate sono **nascosti** all'utente finale e accessibili
solo tramite scorciatoie da tastiera — così i bambini non possono modificare accidentalmente
le impostazioni.

### ⌨️ Scorciatoie da tastiera

| Azione | Windows / Linux | macOS |
|---|---|---|
| Apri/chiudi **Coordinate** | `Ctrl + Shift + 8` | `Cmd + 8` |
| Avvia/annulla **Calibratore** | `Ctrl + Shift + 9` | `Cmd + 9` |
| Annulla calibrazione | `ESC` | `ESC` |

### Procedura di calibrazione
1. Premi `Ctrl+Shift+9` (o `Cmd+9` su macOS)
2. Il cursore diventa una croce — clicca sul **centro del bulbo rosso**
3. Clicca sul **centro del bulbo giallo**
4. Clicca sul **centro del bulbo verde**
5. Le coordinate vengono **salvate automaticamente** nel browser

Per impostare le coordinate manualmente, usa `Ctrl+Shift+8`.  
Per ripristinare i valori di default, clicca **🔄 Default** nel pannello.

---

## 📱 Compatibilità

| Piattaforma | Supporto |
|---|---|
| Desktop (Chrome, Firefox, Edge) | ✅ Completo |
| Desktop Safari / macOS | ✅ Completo  |
| Tablet (touch) | ✅ Completo |
| Mobile (iOS / Android) | ✅ Completo con toast semaforo animato |

---

## 📁 Struttura del progetto

```
semaforo-merenda/
├── index.html                              # Applicazione completa (single file)
├── assets/
│   ├── audio/
│   │   ├── background.mp3                  # Musica di sottofondo (loop)
│   │   ├── correct.mp3                     # Suono risposta corretta
│   │   ├── error.mp3                       # Suono risposta sbagliata
│   │   └── victory.mp3                     # Fanfara di vittoria
│   └── image/
│       ├── background/
│       │   ├── background.jpg              # Sfondo desktop
│       │   └── background-mobile.png       # Sfondo mobile
│       └── (mobile)pop-up/
│           ├── semaforo-verde.jpg          # Immagine toast risposta corretta
│           └── semaforo-rosso.jpg          # Immagine toast risposta sbagliata
├── README.md                               # Questo file
└── LICENSE                                 # Licenza CC BY-NC 4.0
```

---

## 🔊 Credits audio

| File | Fonte | Licenza |
|---|---|---|
| `correct.mp3` | [Mixkit](https://mixkit.co) | Free, no attribution |
| `error.mp3` | [Mixkit](https://mixkit.co) | Free, no attribution |
| `victory.mp3` | [Mixkit](https://mixkit.co) | Free, no attribution |
| `background.mp3` | [Uppbeat](https://uppbeat.io) | Free Tier — credit obbligatorio |

---

## 🛠️ Tecnologie utilizzate

| Tecnologia | Utilizzo |
|---|---|
| **HTML5** | Struttura dell'applicazione |
| **CSS3** | Animazioni, layout, effetti glow, clip-path toast |
| **JavaScript (ES6+)** | Logica del gioco, ghost manuale, audio, calibrazione, localStorage |
| **[SortableJS 1.15](https://sortablejs.github.io/Sortable/)** | Drag & drop degli alimenti |
| **Web Audio API** | Effetti sonori e musica di sottofondo |
| **localStorage** | Salvataggio impostazioni di calibrazione |

> Nessun framework, nessuna dipendenza backend — tutto gira nel browser.

---

## 📚 Contesto didattico

Progetto realizzato nell'ambito del programma **"La Salute a Tavola e in Palestra"**,  
un percorso di educazione alimentare rivolto agli studenti delle scuole primarie  
del comune di **Nicotera (VV), Calabria**.

L'obiettivo è sensibilizzare i bambini a scegliere in modo consapevole
cosa mangiare durante la merenda quotidiana.

---

## 👤 Autore

**Il Semaforo della Merenda** è un progetto educativo interattivo realizzato
nell'ambito del programma **"La Salute a Tavola e in Palestra"** a Nicotera (VV), Calabria 🇮🇹

### 🧑‍💻 Autore
- **Ideazione, design e coordinamento**: Francesco Taccone ([@Fra702sco](https://github.com/Fra702sco))
- **Sviluppo del codice**: Realizzato con il supporto di **Perplexity AI**

### 🎯 Obiettivo
Sensibilizzare i bambini delle scuole primarie a scegliere in modo
consapevole cosa mangiare durante la merenda quotidiana,
attraverso un gioco interattivo e divertente.

### 🏫 Contesto
Progetto sviluppato durante il **Servizio Civile** 2025/2026
presso il comune di Nicotera (VV), Calabria.

### 🤝 Ringraziamenti
- [Perplexity AI](https://perplexity.ai) — Supporto allo sviluppo del codice

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
```

***

## 📝 Cosa ho aggiornato rispetto alla versione precedente

- ✅ Aggiunta sezione **Schermata iniziale** nelle funzionalità
- ✅ Aggiunta sezione **Musica di sottofondo** con dettagli controlli
- ✅ Aggiunti **Effetti sonori** e **Suono vittoria**
- ✅ Aggiornato **Toast banner mobile** con immagini semaforo
- ✅ Aggiornata **struttura progetto** con cartella `assets/audio/` e immagini toast
- ✅ Aggiunta **Web Audio API** nelle tecnologie
- ✅ Corrette le **scorciatoie da tastiera** (erano `L/K`, nel codice sono `8/9`)