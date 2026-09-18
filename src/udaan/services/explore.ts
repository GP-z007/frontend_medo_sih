import { config } from '@udaan/app/config';
import { apiFetch } from './api';
import { buildExploreFixture, fixtureAirports, fixtureRoutes } from './fixtures/explore';
import type { Airport, ExploreDashboard, RouteSummary, TimeRange } from './types';

export async function getAirports(): Promise<Airport[]> {
  if (config.useMockData) return fixtureAirports;
  try {
    return await apiFetch<Airport[]>('/airports');
  } catch {
    return fixtureAirports;
  }
}

export async function getExploreDashboard(range: TimeRange = '30d'): Promise<ExploreDashboard> {
  if (config.useMockData) return buildExploreFixture();
  try {
    return await apiFetch<ExploreDashboard>(`/explore?range=${range}`);
  } catch {
    return buildExploreFixture();
  }
}

export async function getRouteDetails(
  origin: string,
  destination: string,
  range: TimeRange = '6m',
): Promise<RouteSummary & { fareTrend?: ExploreDashboard['fareTrend']; bookingWindowComparison?: ExploreDashboard['bookingWindowComparison'] }> {
  if (config.useMockData) {
    const found =
      fixtureRoutes.find((r) => r.origin === origin && r.destination === destination) ??
      fixtureRoutes[0];
    const dash = buildExploreFixture(found);
    return {
      ...found,
      fareTrend: dash.fareTrend,
      bookingWindowComparison: dash.bookingWindowComparison,
    };
  }
  try {
    return await apiFetch(`/routes/${origin}/${destination}?range=${range}`);
  } catch {
    const found = fixtureRoutes.find((r) => r.origin === origin && r.destination === destination) ?? fixtureRoutes[0];
    return found;
  }
}
