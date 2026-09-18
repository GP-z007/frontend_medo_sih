# UDAAN — National Airfare Intelligence

Professional Indian airfare intelligence dashboard.

## Quick start

```bash
cp .env.example .env
npm install   # or: bun install
npm run dev   # or: bun run dev
```

- Dashboard: http://localhost:5173
- Explore (scraper view): http://localhost:5173/explore?view=browser
- Backend settings: http://localhost:5173/settings/backend

## Environment

See `.env.example`:

- `VITE_UDAAN_API_BASE_URL` — default `http://localhost:8000/api/v1`
- `VITE_UDAAN_BROWSER_URL` — noVNC URL (default `http://localhost:6080/vnc.html?...`)
- `VITE_UDAAN_USE_MOCK_DATA` — `true` until the backend is available

## Docs

- [BUILD_SPEC.md](BUILD_SPEC.md)
- [API_CONTRACTS.md](API_CONTRACTS.md)
- [TASKS.md](TASKS.md)

## Stack

React + Vite + Cesium + Recharts. Map/aircraft motion utilities were adapted from the prior Cesium codebase; the product identity and UI are UDAAN-only.
