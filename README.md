
# Galactic Twilight: NASA Space Explorer

**A full-stack, production-ready, mobile-friendly NASA web app featuring Astronomy Picture of the Day, Mars Rover Gallery, EPIC Earth images, Near-Earth Object visualizations, and an Asteroid Defense Game. Built with React and Node.js, secured for deployment, and designed to showcase advanced frontend and backend skills.**

---

## 🚀 Features

- **Single-Page, No-Scroll Layout:** All main features fit on a single, visually stunning page, fully responsive for desktop and mobile.
- **APOD (Astronomy Picture of the Day):** Beautiful, AI-captioned NASA images with timeline exploration.
- **Mars Rover Gallery:** Browse Mars photos by date and rover, with mission notifications.
- **EPIC Earth Gallery:** View real-time Earth images from NASA’s EPIC camera.
- **NEO (Near-Earth Objects) Chart:** Visualize asteroid data interactively.
- **Asteroid Defense Game:** Play a real-time game using live asteroid data from NASA’s API.
- **Space Capsule:** Save your favorite discoveries.
- **Space Quiz & Story Mode:** Test your knowledge and enjoy interactive space adventures.
- **Profile & Notifications:** User profile modal and real-time mission notifications.
- **Modern, Animated UI:** Custom SVG loader, animated backgrounds, and polished cards.
- **Mobile-First & Accessible:** Fully responsive, touch-friendly, and accessible.

---

## 🛡️ Security & Production Readiness

- **No secrets in git:** All API keys and secrets are loaded from `.env` files (see below).
- **No npm/yarn conflicts:** All dependencies deduped and locked; only npm is used.
- **Vulnerability-free:** All known npm audit issues resolved.
- **Frontend/Backend decoupled:** All API calls use `REACT_APP_API_URL` for easy deployment.
- **OpenAI API key:** Loaded securely from backend `.env` only.
- **Ready for cloud deployment:** Works on Render, Vercel, Heroku, or any Node/React host.

---

## 🏗️ Setup & Deployment

### 1. Clone the repo
```sh
git clone https://github.com/your-username/nasa-clean.git
cd nasa-clean
```

### 2. Set up environment variables

Create a `.env` file in `backend/`:

```
OPENAI_API_KEY=sk-...yourkey...
NASA_API_KEY=DEMO_KEY
```

**Never commit `.env` files to git!**

### 3. Install dependencies

```sh
cd backend && npm install
cd ../frontend && npm install
```

### 4. Run locally

Start backend:
```sh
cd backend
npm start
```

Start frontend:
```sh
cd ../frontend
npm start
```

The frontend will run on [http://localhost:3000](http://localhost:3000) and connect to the backend at `REACT_APP_API_URL` (set in `.env` or via proxy).

### 5. Deploy

- **Render.com:** Add both `backend` and `frontend` as separate web services. Set environment variables in the dashboard.
- **Vercel/Netlify:** Deploy `frontend` as a static site, `backend` as a serverless function or Node service.
- **Heroku:** Deploy both as separate apps or use a monorepo buildpack.

---

## 🧑‍💻 Technical Highlights

- **React (no TypeScript):** Modern hooks, Suspense, and code-splitting.
- **Node.js/Express backend:** Secure, modular, and API-key protected.
- **No hardcoded secrets:** All keys loaded from environment only.
- **SVG loader:** Custom animated loader for all async content.
- **WebSocket notifications:** Real-time mission updates.
- **Mobile-first CSS:** Responsive, no-scroll, and touch-optimized.
- **Accessibility:** Keyboard navigation, ARIA labels, and color contrast.

---

## 🌟 Portfolio/Interview Enhancements (Ideas)

- Add PWA support (installable, offline mode)
- OAuth login (Google, GitHub)
- More gamification (leaderboards, achievements)
- Advanced accessibility (screen reader, high-contrast mode)
- Internationalization (i18n)
- Unit/integration tests (Jest, React Testing Library)
- CI/CD pipeline (GitHub Actions)

---

## 📁 Project Structure

```
backend/      # Node.js/Express API server
frontend/     # React app (all UI code)
scripts/      # Data fetch scripts
README.md     # This file
```

---

## 🤝 Credits

- NASA Open APIs
- OpenAI GPT
- [PRATIK KOLI] (project lead)

---
