import type { SystemStatus, ScraperStatus, LiveFlight } from '../types';

export const fixtureSystemStatus: SystemStatus = {
  dataState: 'MOCK',
  updatedAt: new Date().toISOString(),
  sources: [
    { name: 'IndiGo', status: 'Healthy', lastUpdate: '2 min ago', records: 4281 },
    { name: 'Air India', status: 'Healthy', lastUpdate: '4 min ago', records: 3904 },
    { name: 'Air India Express', status: 'Healthy', lastUpdate: '5 min ago', records: 2506 },
    { name: 'Akasa Air', status: 'Healthy', lastUpdate: '5 min ago', records: 2107 },
    { name: 'SpiceJet', status: 'Delayed', lastUpdate: '18 min ago', records: 1783 },
  ],
  scrapingAgents: { online: 6, total: 6 },
  postgresql: 'Healthy',
  mathEngine: 'Healthy',
  lastScrapeAgo: '3 min ago',
  recordsToday: 18402,
  rejected: 217,
  duplicates: 96,
  outliers: 34,
  browserAgent: {
    status: 'Running',
    browserConnected: true,
    source: 'IndiGo',
    route: 'DEL → BOM',
    stage: 'Collecting prices',
    recordsThisTask: 284,
  },
};

export const fixtureScraperStatus: ScraperStatus = {
  status: 'idle',
  browser_connected: false,
  source: null,
  route: null,
  stage: null,
  records_collected: null,
  started_at: null,
  last_activity_at: null,
};

/** Empty by default — live flights are optional and offline without backend. */
export const fixtureLiveFlights: LiveFlight[] = [];
