# 🎙️ Voice Diary

> Speak your mind. AI does the rest.

A fully local, AI-powered voice diary. Record your thoughts through the microphone, and the app automatically transcribes your speech, refines it into a beautiful diary entry using a local LLM, and presents it back as a cinematic story with mood-based visuals — all without a single cloud dependency.

---

## ✨ Features

- **Voice Recording** — one tap to record, one tap to stop
- **Local Speech-to-Text** — powered by faster-whisper (Whisper base model, runs fully on CPU)
- **AI Refinement** — raw transcripts refined into emotionally resonant diary entries via Ollama (llama3.2)
- **Mood Detection** — automatically tags each entry with a mood: happy, sad, nostalgic, anxious, excited, calm, or angry
- **Story View** — revisit entries as a cinematic full-screen story with mood-matched gradient backgrounds and animated text reveals
- **100% Local** — no internet required after setup; all AI runs on your machine

---

## 🛠️ Tech Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| Frontend       | Next.js 15, Tailwind CSS, Framer Motion |
| Speech-to-Text | faster-whisper (Python + FastAPI)       |
| AI Refinement  | Ollama (llama3.2)                       |
| Database       | MongoDB (local)                         |
| Monorepo       | Turborepo + npm workspaces              |

---

## 📁 Project Structure

```
voice-diary/
├── apps/
│   ├── web/          # Next.js app (frontend + API routes)
│   └── stt/          # Python faster-whisper microservice
├── packages/
│   └── db/           # Shared Mongoose models
├── scripts/
│   ├── setup.ps1     # One-time setup script (Windows)
│   ├── start-mongo.ps1
│   ├── start-ollama.ps1
│   └── start-stt.ps1
├── data/             # Local MongoDB data (gitignored)
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed before running setup:

- [Node.js](https://nodejs.org/) v18+
- [Python](https://www.python.org/) 3.10+
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) 6.0+
- [Ollama](https://ollama.com/) (with llama3.2 pulled)
- Windows 10/11 (scripts are PowerShell — Linux/Mac users replace `.ps1` with `.sh`)

### Installation

**1. Clone the repo**

```bash
git clone https://github.com/Prabodh-dev/voice-diary.git
cd voice-diary
```

**2. Create your environment file**

```bash
cp .env.example apps/web/.env.local
```

Edit `apps/web/.env.local`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/voice-diary
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
STT_URL=http://localhost:8000
```

**3. Run one-time setup**

```powershell
npm run setup
```

This will install all Node and Python dependencies, create the Python virtual environment, and pull the llama3.2 model from Ollama.

### Running the App

```powershell
npm run dev
```

This single command starts all four services together:

| Service     | Port  | Status                   |
| ----------- | ----- | ------------------------ |
| MongoDB     | 27017 | starts automatically     |
| Ollama      | 11434 | skips if already running |
| Whisper STT | 8000  | starts Python service    |
| Next.js Web | 3000  | main app                 |

Open [http://localhost:3000](http://localhost:3000)

---

## 🎬 How It Works

```
🎤 You speak
    ↓
📝 faster-whisper transcribes audio → raw text
    ↓
🤖 Ollama (llama3.2) rewrites it → title, refined entry, mood, tags
    ↓
💾 Saved to MongoDB
    ↓
🎨 Story view renders with mood gradient + Framer Motion animations
```

---

## 📱 Pages

### `/` — Record Page

Tap the mic, speak your diary entry, tap stop. The app handles the rest — transcription, refinement, and saving happen automatically.

### `/diary` — Entries List

All your entries listed with mood-colored cards, date, title, summary, and tags at a glance.

### `/diary/[id]` — Story View

Full-screen cinematic view of an entry. Mood-matched gradient background, animated text reveal, and a toggle to compare with the original raw transcript.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---
