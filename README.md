# 3D Solar System Simulation

A cinematic, interactive 3D solar system explorer built with Three.js and Anime.js, plus a small Node/Express proxy to keep a generative AI API key secure. This project renders planets, rings, moons, a comet and particle starfield — and includes an "AI Mission Control" feature that generates short responses via the Gemini/Generative Language API (proxied by the server so the key is never exposed to the browser).

**Tech Stack**

- Frontend: plain HTML/CSS + Three.js (r128), OrbitControls, Anime.js for motion and UI transitions.
- Backend: `server.js` — lightweight Express server used to serve static files and proxy AI requests to the Generative Language API.
- Dev: `npm` scripts, `nodemon` for development, `dotenv` for local environment variables.

**Key Files**

- `index.html` — main client UI and simulation code.
- `server.js` — Express server; exposes `POST /api/gemini` which accepts `{ prompt }` and forwards it to the Generative Language API using the server-side `API_KEY`.
- `package.json` — scripts and dependencies (`express`, `cors`, `dotenv`).
- `.env.example` — example environment file. Copy to `.env` and set your `API_KEY`.

Why the server proxy exists

- The project previously attempted to read `process.env.API_KEY` in the browser which exposes secrets. The proxy design keeps `API_KEY` on the server only. The frontend calls `/api/gemini` and receives only generated text.

Security & Deployment

- Never commit `.env`; `.gitignore` already ignores it.
- When deploying, set `API_KEY` in your host platform's environment (Vercel, Heroku, Render, etc.) rather than storing it in source.
- Consider adding rate-limiting, authentication, or request quotas to `/api/gemini` if you plan to make the app public.

Quick Start (local)

1. Copy example env and add your key:

```bash
cp .env.example .env
# Edit .env and set API_KEY=YOUR_REAL_API_KEY
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
# or for dev auto-reload:
npm run dev
```

4. Open your browser at `http://localhost:3000`.

Notes on robustness and recent fixes

- Broken or missing remote textures will now be handled gracefully by a `safeLoadTexture` helper: failed texture loads produce a small canvas fallback texture and print a console warning. This prevents rendering errors when a remote asset 404s.
- The client script is loaded as a module; inline `onclick` handlers in the HTML expected globals and produced `ReferenceError`s. To preserve the existing HTML structure we explicitly expose UI functions (`togglePause`, `resetView`, `toggleTour`, `closePanel`, `askGemini`) on `window`.

Ideas & Next Steps

- Replace inline `onclick` attributes with `addEventListener` for cleaner, module-friendly code.
- Add authentication (e.g., API tokens or user sessions) and rate limiting on `/api/gemini`.
- Bundle and version static textures locally to avoid remote 404s and reduce external dependencies.
- Add unit tests for the server endpoint and integration tests for the fetch flow.

Contributing

- Fork the repo, make changes on a feature branch, and open a pull request. Keep secrets out of commits.

License

- This repository does not include a license file. Add one (e.g., MIT) if you intend to open-source it.

Credits

- Textures and planet imagery: Wikimedia Commons and public domain sources where used.
- Three.js examples and helpers form the rendering backbone.

If you want, I can also:

- Replace the currently-broken Neptune/Io/Titan texture URLs with local assets or updated remote links.
- Remove inline handlers and refactor event wiring to modern patterns.

Enjoy exploring the solar system!
