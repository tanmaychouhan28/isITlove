<div align="center">

# ♥ isITlove

### The Dating App for Developers — Find Your Perfect Code Partner

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://isitlove.onrender.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/atlas)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-010101?style=for-the-badge&logo=socket.io)](https://socket.io)

> *"It's not about who you merge with — it's about who you ship with."*

</div>

---

## ✨ What is isITlove?

**isITlove** is a developer-first dating and networking app that matches you based on what actually matters — your **GitHub contributions**, **LeetCode grind**, **LinkedIn experience**, and **tech stack**. Forget generic bios. We verify you're the real deal.

Whether you're looking for a **co-founder**, a **pair programming partner**, or your **10x soulmate**, isITlove finds developers who genuinely complement your skills.

---

## 🚀 Features

### 🔍 Smart Discovery
- **Tinder-style swipe cards** with full developer profiles
- **Compatibility score** computed from shared stack & interests
- Section-specific likes — love someone's projects? Like that section directly
- Keyboard shortcuts (← pass, → like, Space = super like)
- Daily coding fortune + "love language" 💡

### 🧠 Multi-Platform Intelligence
- **GitHub Analysis** — repos, stars, top languages, contribution graph, featured projects
- **LeetCode Analysis** — problems solved, difficulty breakdown, ranking
- **LinkedIn Analysis** — headline, experience level, career stage
- **DevScore** — a composite score across all three platforms
- One-click **Re-Analyze** to refresh live data anytime

### 💜 Matching & Messaging
- Mutual like = **Clean Merge** (match!) with instant notification
- **Real-time chat** powered by Socket.io
- Code snippet sharing with syntax highlighting and language picker
- Typing indicators and quick dev icebreakers
- Matched section + optional comment shown in chat

### 🏆 Leaderboard
- Top developers ranked by DevScore
- Filter by: Frontend, Backend, AI/ML, Mobile, DevOps
- Podium-style top 3 display

### 🎨 Design
- Dark / Light theme toggle
- Glassmorphism UI with aurora mesh background
- Spring-physics animations & micro-interactions
- Fully responsive (mobile bottom nav, desktop top nav)
- Floating hearts + DevCupid mascot 🏹

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, React Router 7 |
| **Styling** | Vanilla CSS, CSS Variables, Animations |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Atlas in prod, in-memory fallback in dev) |
| **Real-Time** | Socket.io (v4) |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **HTTP Client** | Axios |
| **Deployment** | Render (single service — full-stack) |

---

## 📁 Project Structure

```
isITlove/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── MatchOverlay.jsx
│   │   │   ├── LikeModal.jsx
│   │   │   ├── EditProfileModal.jsx
│   │   │   ├── CodeSnippetModal.jsx
│   │   │   ├── FloatingHearts.jsx
│   │   │   └── DevCupidMascot.jsx
│   │   ├── pages/
│   │   │   ├── Discover.jsx   # Swipe feed
│   │   │   ├── Matches.jsx    # Your matches
│   │   │   ├── Messages.jsx   # Real-time chat
│   │   │   ├── Leaderboard.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Auth + API client
│   │   └── utils/
│   │       └── audio.js       # Sound effects
│   └── vite.config.js
│
├── server/                    # Express backend
│   ├── routes/
│   │   ├── auth.js            # Login, signup, demo
│   │   ├── users.js           # Profile, discover, leaderboard
│   │   ├── matches.js         # Like, match detection
│   │   └── messages.js        # Chat messages
│   ├── models/
│   │   ├── User.js
│   │   ├── Match.js
│   │   └── Message.js
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── utils/
│   │   └── analyzer.js        # GitHub/LC/LinkedIn scraper
│   ├── socket.js              # Socket.io handlers
│   ├── seedData.js            # Demo user seeder
│   └── index.js              # Entry point
│
├── .env.example               # Template for env variables
├── .gitignore
├── render.yaml                # Render deploy config
└── package.json               # Root package.json
```

---

## ⚙️ Local Development

### Prerequisites
- Node.js 20+
- MongoDB (local) **or** use the built-in in-memory server (zero config!)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/isitlove.git
cd isitlove
```

### 2. Set up environment variables
```bash
cp .env.example server/.env
# Edit server/.env with your values
```

### 3. Install dependencies
```bash
# Server deps
cd server && npm install

# Client deps
cd ../client && npm install
```

### 4. Run both servers
```bash
# Terminal 1 — Backend (http://localhost:5000)
cd server && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd client && npm run dev
```

> **No MongoDB?** No problem. The server auto-boots a MongoDB in-memory instance — just start it and everything works.

---

## 🌐 Deploy to Render

This repo is pre-configured for **Render** with `render.yaml`.

### Steps:
1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Render auto-detects `render.yaml` and configures everything
5. Add these **Environment Variables** in the Render dashboard:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a strong random secret
   - `NODE_ENV` — `production`

That's it. Render builds the client and starts the server. 🎉

---

## 🔒 Security Notes

- **`.env` is gitignored** — never committed
- JWT-protected API routes
- Passwords hashed with bcrypt (salt rounds: 10)
- Socket.io `new-match` events are scoped to matched users only (not global broadcast)
- `/purge-bots` admin route requires valid JWT

---

##  Author

Built with ❤️ by **Tanmay**

---

## 📄 License

MIT — use it, fork it, ship it.

---

<div align="center">
<sub>Made for developers who want to debug loneliness, one PR at a time. 🚀</sub>
</div>
