import { config } from '@udaan/app/config';
import { apiFetch, fetchHealth } from './api';
import { fixtureSystemStatus, fixtureScraperStatus, fixtureLiveFlights } from './fixtures/systemStatus';
import type { HealthResponse, LiveFlight, ScraperStatus, SystemStatus } from './types';
import type { AnalyticsFilters } from './types';

export async function getSystemStatus(): Promise<SystemStatus> {
  if (config.useMockData) return { ...fixtureSystemStatus, dataState: 'MOCK' };
  try {
    return await apiFetch<SystemStatus>('/system/status');
  } catch {
    return { ...fixtureSystemStatus, dataState: 'UNAVAILABLE' };
  }
}

export async function getHealth(): Promise<HealthResponse & { ok: boolean; endpoint: string }> {
  const result = await fetchHealth();
  return {
    ok: result.ok,
    endpoint: result.endpoint,
    status: result.ok ? String(result.body?.status ?? 'ok') : 'unavailable',
    version: result.body?.version != null ? String(result.body.version) : undefined,
    database: result.body?.database != null ? String(result.body.database) : undefined,
    api: result.body?.api != null ? String(result.body.api) : undefined,
    latencyMs: result.latencyMs,
  };
}

export async function getScraperStatus(): Promise<ScraperStatus | null> {
  if (config.useMockData) return fixtureScraperStatus;
  try {
    return await apiFetch<ScraperStatus>('/scraper/status');
  } catch {
    return null;
  }
}

export async function getLiveFlights(bbox?: string): Promise<LiveFlight[]> {
  if (config.useMockData) return fixtureLiveFlights;
  try {
    const q = bbox ? `?bbox=${encodeURIComponent(bbox)}` : '';
    return await apiFetch<LiveFlight[]>(`/live-flights${q}`);
  } catch {
    return [];
  }
}

export type ExportFormat = 'csv' | 'xlsx' | 'json';

export async function exportAnalytics(
  format: ExportFormat,
  filters: Partial<AnalyticsFilters>,
): Promise<{ ok: boolean; message: string; blob?: Blob }> {
  if (config.useMockData) {
    const payload = JSON.stringify({ format, filters, note: 'MOCK export — backend not connected' }, null, 2);
    return {
      ok: true,
      message: 'Mock export generated (development)',
      blob: new Blob([payload], { type: 'application/json' }),
    };
  }
  const qs = new URLSearchParams({
    format,
    range: filters.range ?? '6m',
    region: filters.region ?? 'all-india',
    route: filters.route ?? 'all',
    airline: filters.airline ?? 'all',
    booking_window: filters.bookingWindow ?? 'all',
    fare_type: filters.fareType ?? 'economy',
  });
  try {
    const base = config.apiBaseUrl.replace(/\/$/, '');
    const res = await fetch(`${base}/analytics/export?${qs}`);
    if (!res.ok) throw new Error('Export failed');
    const blob = await res.blob();
    return { ok: true, message: 'Export ready', blob };
  } catch {
    return { ok: false, message: 'Export unavailable — backend not reachable' };
  }
}

export { getHealth as healthService };
