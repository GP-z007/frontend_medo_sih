# UDAAN — API Contracts

Base URL: `VITE_UDAAN_API_BASE_URL` (default `http://localhost:8000/api/v1`)

## Endpoints
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Backend health |
| GET | `/explore?range=` | Explore dashboard |
| GET | `/routes/:origin/:dest?range=` | Route detail |
| GET | `/airports` | Airport list |
| GET | `/analytics?...` | Analytics dashboard |
| GET | `/system/status` | Data operations status |
| GET | `/live-flights?bbox=` | Optional live aircraft |
| GET | `/scraper/status` | Scraper metadata (optional) |
| GET | `/analytics/export?format=` | CSV/XLSX/JSON export |

## Ranges
`today` | `7d` | `30d` | `1y` | `6m`

## Booking windows
`T+1` | `T+7` | `T+15` | `T+30` | `T+45`

## Data states
`LIVE` | `CACHED` | `DELAYED` | `UNAVAILABLE` | `MOCK`

## Route trend
`rising` | `falling` | `stable`

When `VITE_UDAAN_USE_MOCK_DATA=true`, services return fixtures with `dataState: "MOCK"`.
