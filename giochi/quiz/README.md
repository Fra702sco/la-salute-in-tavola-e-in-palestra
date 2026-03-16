# 🧠 Quiz Alimentare

> Gioco educativo a quiz sulla nutrizione, sport e vitamine per bambini delle scuole primarie

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)
![Status](https://img.shields.io/badge/status-active-brightgreen)

---

## 🎮 Di cosa si tratta

**Il Quiz Alimentare** è un gioco a domande e risposte pensato per bambini delle scuole primarie.
Ogni partita propone **15 domande casuali** tratte da una banca dati di **70+ domande** divise in
9 categorie tematiche. Per vincere bisogna rispondere correttamente a tutte e 15 le domande
commettendo al massimo 3 errori, entro un tempo totale di **4 minuti e 5 secondi**.

---

## 📋 Regole

| Regola | Valore |
|---|---|
| Domande per partita | 15 (casuali) |
| Tempo per domanda | 15 secondi |
| Tempo totale | 4 minuti e 5 secondi |
| Errori massimi | 3 |
| Domande in banca dati | 70+ |

---

## 🗂️ Categorie

| Categoria | Emoji | Descrizione |
|---|---|---|
| 🍎 Frutta | `bg-frutta` | Proprietà della frutta e quando mangiarla |
| 🥦 Verdura | `bg-verdura` | Vitamine e benefici delle verdure |
| 🌾 Cereali | `bg-cereali` | Pane, pasta, riso e carboidrati |
| 🥛 Latticini | `bg-latticini` | Latte, formaggi, yogurt e calcio |
| 🍗 Proteine | `bg-proteine` | Carne, pesce, uova e legumi |
| 🍬 Dolci & Zuccheri | `bg-dolci` | Zuccheri, merendine e consumo consapevole |
| 🏃 Sport & Movimento | `bg-sport` | Attività fisica e benefici per il corpo |
| 💧 Idratazione | `bg-acqua` | Acqua, dissetarsi e idratazione |
| 🌈 Vitamine | `bg-vitamine` | Vitamine A, B, C, D, E, K e loro funzioni |

---

## ✨ Funzionalità

- 🎲 **Domande casuali** — ogni partita è diversa, estratte a random dalla banca dati
- 🌈 **Background dinamico per categoria** — lo sfondo cambia colore e tema ad ogni domanda
- 🌊 **Particelle emoji animate** — galleggiano sullo sfondo in base alla categoria corrente
- ⏱️ **Timer doppio** — cerchio SVG animato per la domanda (15 sec) + timer totale (4:05)
- 🔴 **Urgenza visiva** — i bottoni tremano quando mancano meno di 5 secondi alla domanda
- ✅ **Toast notifica** — popup animato in basso (verde = corretto, rosso = sbagliato, arancio = tempo scaduto)
- ❌ **Indicatore errori** — 3 pallini rossi che si accendono ad ogni errore
- 🏆 **Schermata Vittoria** con coriandoli colorati (90 pezzi) e valutazione a stelle (1-5 ⭐)
- 😵 **Schermata Hai Perso** con motivo della sconfitta e statistiche
- 📋 **Riepilogo errori finale** — mostra per ogni errore: domanda, risposta data, risposta corretta e tempo impiegato; affiancato alla card risultato su desktop, sotto con scroll su mobile
- 📊 **Statistiche finali** — risposte corrette, errori, domanda raggiunta, tempo impiegato
- 🎵 **Musica di sottofondo** con controllo on/off
- 🔊 **Effetti sonori** — correct, wrong, victory, gameover, tick (conto alla rovescia)
- 🏠 **Bottone Home con conferma** — modale "Sei sicuro di voler uscire?" per evitare uscite accidentali
- ℹ️ **Pannello About** — informazioni sul progetto
- ♿ **Accessibilità** — ARIA completo, `aria-live` su feedback e timer
- 📱 **Completamente responsive** — desktop, tablet e mobile con scroll nativo iOS

---

## 📂 Banca dati domande esterna

Le domande e le categorie sono gestite tramite un file JSON separato:

```
assets/domande-risposte/domande.json
```

Questo permette di **aggiungere, modificare o correggere domande** senza toccare il codice JavaScript.

### Struttura del file

```json
{
  "domande": [
    {
      "categoria": "frutta",
      "testo": "🍎 Testo della domanda?",
      "risposte": ["Risposta A", "Risposta B", "Risposta C", "Risposta D"],
      "corretta": 1
    }
  ],
  "categorie": {
    "frutta": {
      "label": "🍎 Frutta",
      "emoji": ["🍎", "🍊", "🍋"],
      "bgClass": "bg-frutta",
      "timerColor": "#e53935"
    }
  }
}
```

> `corretta` è l'indice (0-3) della risposta corretta nell'array `risposte`.

### Come aggiungere una domanda

1. Apri `assets/domande-risposte/domande.json`
2. Aggiungi un oggetto nell'array `domande` seguendo la struttura sopra
3. Salva — la domanda sarà disponibile alla prossima partita

---

## 🚀 Come usarlo

### ⚠️ Requisito — server locale o GitHub Pages

Il Quiz usa `fetch()` per caricare il file `domande.json`.
Aprendo direttamente `index.html` come file locale (`file://`) il browser blocca la richiesta.

**Soluzioni:**

```bash
# Con Python
python -m http.server 8000
# poi apri http://localhost:8000/giochi/quiz/

# Con Node.js / npx
npx serve .
```

Oppure usa direttamente **GitHub Pages**:
👉 **https://fra702sco.github.io/la-salute-in-tavola-e-in-palestra/giochi/quiz/**

---

## 📁 Struttura del progetto

```
giochi/quiz/
├── index.html                              # HTML principale
├── README.md                               # Questo file
├── LICENSE                                 # Licenza CC BY-NC 4.0
└── assets/
    ├── css/
    │   └── style.css                       # Stili del gioco
    ├── js/
    │   └── quiz.js                         # Logica del gioco
    ├── domande-risposte/
    │   └── domande.json                    # Banca dati domande + config categorie
    └── audio/
        ├── background.mp3                  # Musica di sottofondo (loop)
        ├── correct.mp3                     # Suono risposta corretta
        ├── error.mp3                       # Suono risposta sbagliata
        ├── victory.mp3                     # Fanfara di vittoria
        ├── loss.mp3                        # Suono game over
        └── tick.mp3                        # Conto alla rovescia finale
```

---

## 🏗️ Architettura del codice

### `quiz.js` — struttura interna

```
DOMContentLoaded
 ├── §0   Config & Costanti (CFG: timer, max errori, url, volumi)
 ├── §1   DOMANDE — variabile (popolata da fetch in §16)
 ├── §2   CATEGORIE — variabile (popolata da fetch in §16)
 ├── §3   Riferimenti DOM
 ├── §4   Stato di gioco (S: indice, corrette, errori, attiva...)
 ├── §5   Sistema Audio (AUDIO: play, stopBg, toggleBg)
 ├── §6   Sistema Background & Particelle (BG: setCat, spawnParticle, clear)
 ├── §7   Sistema Timer (TIMER: domanda SVG, totale, urgenza, stopAll)
 ├── §8   Motore di gioco (startGame → caricaDomanda → onRisposta → finePartita)
 ├── §9   Sistema Toast (notifiche popup animate per esito risposta)
 ├── §10  Sistema Confetti (CONFETTI: 90 pezzi colorati)
 ├── §11  Sistema Stelle (1-5 ⭐ in base a errori e tempo)
 ├── §12  Gestione Schermate (SCHERMATE: mostraSuccesso, mostraGameover + buildRecap)
 ├── §13  Pannelli (confirm-home, about)
 ├── §14  Scorciatoie tastiera (ESC, Ctrl+R)
 ├── §15  Event Listeners
 └── §16  Init async — fetch domande.json → abilita pulsante start
```

### `style.css` — struttura interna

```
Reset → Variabili CSS → Body → Background scene →
Particelle emoji → Header gioco → Timer SVG →
Card domanda → Bottoni risposta (stati: correct/wrong/urgent) →
Feedback → Schermate risultato (successo/gameover) →
Riepilogo errori → Stelle → Confetti →
Modale confirm-home → Pannello About → Toast →
Progress bar domanda → Responsive (tablet → mobile → ≤380px)
```

---

## 🔊 Credits audio

| File | Fonte | Licenza |
|---|---|---|
| `correct.mp3`    | [Pixabay](https://pixabay.com) | Free — no attribution required |
| `error.mp3`      | [Pixabay](https://pixabay.com) | Free — no attribution required |
| `victory.mp3`    | [Mixkit](https://mixkit.co)   | Free — no attribution required |
| `loss.mp3`       | [Pixabay](https://pixabay.com) | Free — no attribution required |
| `tick.mp3`       | [Pixabay](https://pixabay.com) | Free — no attribution required |
| `background.mp3` | [Uppbeat](https://uppbeat.io) | Free Tier — credit obbligatorio |

---

## 🛠️ Tecnologie utilizzate

| Tecnologia | Utilizzo |
|---|---|
| **HTML5 semantico** | Struttura + accessibilità ARIA |
| **CSS3** | Animazioni, glassmorphism, background dinamici per categoria |
| **JavaScript ES6+** | Logica quiz, timer, audio, particelle, stelle |
| **SVG** | Timer circolare animato (stroke-dashoffset) |
| **Fetch API** | Caricamento domande da `domande.json` |
| **Web Audio API** | Effetti sonori e musica |

> Nessun framework, nessuna dipendenza backend — tutto gira nel browser.

---

## ♿ Accessibilità

- `role="dialog"` + `aria-modal` + `aria-labelledby` su tutti i pannelli
- `aria-hidden="true"` su elementi decorativi (particelle, confetti)
- `role="status"` + `aria-live="polite"` su timer e feedback risposta
- `aria-label` su tutti i bottoni icon-only
- `aria-disabled` sul pulsante Start durante il caricamento delle domande

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
- **Sviluppo del codice**: Realizzato con il supporto di **Perplexity AI** e **Claude Code (Anthropic)**

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
