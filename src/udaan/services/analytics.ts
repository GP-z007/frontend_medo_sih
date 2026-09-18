import { config } from '@udaan/app/config';
import { apiFetch } from './api';
import { buildAnalyticsFixture } from './fixtures/analytics';
import type { AnalyticsDashboard, AnalyticsFilters } from './types';

const defaultFilters: AnalyticsFilters = {
  range: '6m',
  region: 'all-india',
  route: 'all',
  airline: 'all',
  bookingWindow: 'all',
  fareType: 'economy',
};

export async function getAnalyticsDashboard(
  filters: Partial<AnalyticsFilters> = {},
): Promise<AnalyticsDashboard> {
  const f = { ...defaultFilters, ...filters };
  if (config.useMockData) return buildAnalyticsFixture(f);
  const qs = new URLSearchParams({
    range: f.range,
    region: f.region,
    route: f.route,
    airline: f.airline,
    booking_window: f.bookingWindow,
    fare_type: f.fareType,
  });
  try {
    return await apiFetch<AnalyticsDashboard>(`/analytics?${qs}`);
  } catch {
    return buildAnalyticsFixture(f);
  }
}
