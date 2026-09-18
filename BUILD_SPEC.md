# UDAAN — Build Spec

## Product
**UDAAN — National Airfare Intelligence**: Indian airfare analytics dashboard (Explore, Analytics, Data Operations). Not a God’s Eye reskin.

## Non-negotiables
- No God’s Eye / Ghost / tactical / military / surveillance branding or network calls
- Cesium India map is real and interactive; airfare routes are primary; live aircraft optional (default OFF)
- UI consumes service functions only; mock numbers live in fixtures
- Config via `VITE_UDAAN_*` only, centralized in `src/udaan/app/config.ts`
- Booking windows: T+1, T+7, T+15, T+30, T+45
- National Airfare Index is an index (base 100), not a rupee amount
- noVNC browser loads only when Live Scraper Browser view is selected

## Stack
React 18 + React Router + Vite 6 + Cesium + Recharts. Prefer Bun when available; npm is supported.

## Structure
`src/udaan/` is the sole application. Legacy God’s Eye code must not be imported by the entrypoint.

## URLs (dev)
- Frontend: http://localhost:5173
- Explore browser: http://localhost:5173/explore?view=browser
- Backend settings: http://localhost:5173/settings/backend
- API: http://localhost:8000/api/v1
- noVNC: http://localhost:6080/vnc.html
