import type { Airport, ExploreDashboard, RouteSummary, TimeRange } from '@udaan/services/types';

export type HeroView = 'map' | 'browser';

export interface DashboardState {
  range: TimeRange;
  selectedRouteKey: string | null;
  heroView: HeroView;
  liveFlights: boolean;
  playbackIndex: number;
  searchQuery: string;
  explore: ExploreDashboard | null;
  airports: Airport[];
  loading: boolean;
}

export function routeKey(r: Pick<RouteSummary, 'origin' | 'destination'>): string {
  return `${r.origin}-${r.destination}`;
}

export function findRoute(
  routes: RouteSummary[],
  origin: string,
  destination: string,
): RouteSummary | undefined {
  return routes.find((r) => r.origin === origin && r.destination === destination);
}

export function parseRouteSearch(
  query: string,
  airports: Airport[],
): { origin?: Airport; destination?: Airport; airport?: Airport } | null {
  const q = query.trim();
  if (!q) return null;

  const arrow = q.split(/\s*(?:→|->|to)\s*/i).filter(Boolean);
  if (arrow.length === 2) {
    const origin = matchAirport(arrow[0], airports);
    const destination = matchAirport(arrow[1], airports);
    if (origin && destination) return { origin, destination };
  }

  const airport = matchAirport(q, airports);
  if (airport) return { airport };
  return null;
}

function matchAirport(token: string, airports: Airport[]): Airport | undefined {
  const t = token.trim().toLowerCase();
  return airports.find(
    (a) =>
      a.iata.toLowerCase() === t ||
      a.city.toLowerCase() === t ||
      a.name.toLowerCase().includes(t),
  );
}

export function formatInr(n: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatPct(n: number): string {
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(1)}%`;
}

export function relativeUpdated(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.round(ms / 60000));
  if (mins < 60) return `Updated ${mins} min ago`;
  const hours = Math.round(mins / 60);
  return `Updated ${hours} h ago`;
}

export function bookingWindowHuman(window: string): string {
  const days = window.replace(/^T\+/i, '').replace(/[^\d]/g, '') || window;
  return `${days} days ahead`;
}

export function compactCount(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m >= 10 ? Math.round(m) : m.toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return n.toLocaleString('en-IN');
}

export function fareVsTypical(fare: number, range: [number, number]): string {
  const [low, high] = range;
  if (fare > high) return `${formatInr(fare - high)} above its typical range.`;
  if (fare < low) return `${formatInr(low - fare)} below the lower end of its typical range.`;
  return `${formatInr(fare - low)} above the lower end of its typical range.`;
}
