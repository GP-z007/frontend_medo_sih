import type { AnalyticsDashboard, AnalyticsFilters } from '../types';

export function buildAnalyticsFixture(_filters?: Partial<AnalyticsFilters>): AnalyticsDashboard {
  return {
    dataState: 'MOCK',
    updatedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    nationalAirfareIndex: 132.4,
    indexBase: 'Base Jan 2024 = 100',
    averageFare: 6420,
    momChangePct: 6.4,
    yoyChangePct: 11.2,
    routesMonitored: 42,
    airportsCovered: 28,
    totalObservations: 184000,
    indexTrend: Array.from({ length: 12 }, (_, i) => {
      const d = new Date(2025, i, 1);
      return {
        date: d.toISOString().slice(0, 7),
        index: 100 + i * 2.4 + Math.sin(i) * 1.5,
      };
    }),
    topRisingRoutes: [
      { route: 'DEL → BOM', changePct: 14.2, fare: 6420 },
      { route: 'DEL → BLR', changePct: 11.4, fare: 7120 },
      { route: 'DEL → PNQ', changePct: 9.2, fare: 4780 },
      { route: 'BOM → BLR', changePct: 8.1, fare: 4850 },
      { route: 'DEL → SXR', changePct: 7.5, fare: 5800 },
    ],
    bookingWindowAverages: [
      { window: 'T+1', label: 'Tomorrow', fare: 8650 },
      { window: 'T+7', label: '7 days', fare: 7580 },
      { window: 'T+15', label: '15 days', fare: 6800 },
      { window: 'T+30', label: '30 days', fare: 6420 },
      { window: 'T+45', label: '45 days', fare: 6680 },
    ],
    airlineMovement: [
      { airline: 'IndiGo', changePct: 5.8 },
      { airline: 'Air India', changePct: 7.1 },
      { airline: 'Akasa Air', changePct: 3.2 },
      { airline: 'SpiceJet', changePct: 6.4 },
      { airline: 'Air India Express', changePct: 4.0 },
    ],
    indexVsCpi: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2025, i, 1).toISOString().slice(0, 7),
      airfareIndex: 100 + i * 2.4,
      transportCpi: 100 + i * 1.1,
    })),
    keyInsights: [
      'Domestic fares rose 6.4% month-on-month, led by Delhi trunk routes.',
      'Booking 30 days ahead remains the lowest average window nationally.',
      'HYD → MAA is the strongest declining corridor this period (-7.1%).',
      'IndiGo and Air India together account for most observation volume.',
    ],
  };
}
