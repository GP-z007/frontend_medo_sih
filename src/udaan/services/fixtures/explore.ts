import type { Airport, ExploreDashboard, RouteSummary } from '../types';

export const fixtureAirports: Airport[] = [
  { iata: 'DEL', name: 'Indira Gandhi International', city: 'Delhi', lat: 28.5562, lon: 77.1, region: 'North' },
  { iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', city: 'Mumbai', lat: 19.0896, lon: 72.8656, region: 'West' },
  { iata: 'BLR', name: 'Kempegowda International', city: 'Bengaluru', lat: 13.1986, lon: 77.7066, region: 'South' },
  { iata: 'MAA', name: 'Chennai International', city: 'Chennai', lat: 12.9941, lon: 80.1709, region: 'South' },
  { iata: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad', lat: 17.2403, lon: 78.4294, region: 'South' },
  { iata: 'CCU', name: 'Netaji Subhas Chandra Bose International', city: 'Kolkata', lat: 22.6547, lon: 88.4467, region: 'East' },
  { iata: 'COK', name: 'Cochin International', city: 'Kochi', lat: 10.152, lon: 76.4019, region: 'South' },
  { iata: 'GOI', name: 'Goa International (Dabolim)', city: 'Goa', lat: 15.3808, lon: 73.8314, region: 'West' },
  { iata: 'PNQ', name: 'Pune Airport', city: 'Pune', lat: 18.5822, lon: 73.9197, region: 'West' },
  { iata: 'AMD', name: 'Sardar Vallabhbhai Patel International', city: 'Ahmedabad', lat: 23.0772, lon: 72.6347, region: 'West' },
  { iata: 'JAI', name: 'Jaipur International', city: 'Jaipur', lat: 26.8242, lon: 75.8122, region: 'North' },
  { iata: 'LKO', name: 'Chaudhary Charan Singh International', city: 'Lucknow', lat: 26.7606, lon: 80.8893, region: 'North' },
  { iata: 'PAT', name: 'Jay Prakash Narayan Airport', city: 'Patna', lat: 25.5913, lon: 85.088, region: 'East' },
  { iata: 'GAU', name: 'Lokpriya Gopinath Bordoloi International', city: 'Guwahati', lat: 26.1061, lon: 91.5859, region: 'Northeast' },
  { iata: 'IXC', name: 'Chandigarh Airport', city: 'Chandigarh', lat: 30.6735, lon: 76.7885, region: 'North' },
  { iata: 'TRV', name: 'Trivandrum International', city: 'Thiruvananthapuram', lat: 8.4821, lon: 76.9201, region: 'South' },
  { iata: 'IXB', name: 'Bagdogra Airport', city: 'Bagdogra', lat: 26.6812, lon: 88.3286, region: 'East' },
  { iata: 'NAG', name: 'Dr. Babasaheb Ambedkar International', city: 'Nagpur', lat: 21.0922, lon: 79.0472, region: 'Central' },
  { iata: 'IDR', name: 'Devi Ahilya Bai Holkar Airport', city: 'Indore', lat: 22.7218, lon: 75.8011, region: 'Central' },
  { iata: 'BBI', name: 'Biju Patnaik International', city: 'Bhubaneswar', lat: 20.2444, lon: 85.8178, region: 'East' },
  { iata: 'VNS', name: 'Lal Bahadur Shastri Airport', city: 'Varanasi', lat: 25.4524, lon: 82.8593, region: 'North' },
  { iata: 'SXR', name: 'Sheikh ul-Alam International', city: 'Srinagar', lat: 33.9871, lon: 74.7743, region: 'North' },
  { iata: 'IXJ', name: 'Jammu Airport', city: 'Jammu', lat: 32.6891, lon: 74.8375, region: 'North' },
  { iata: 'IXR', name: 'Birsa Munda Airport', city: 'Ranchi', lat: 23.3143, lon: 85.3217, region: 'East' },
  { iata: 'IMF', name: 'Imphal International', city: 'Imphal', lat: 24.76, lon: 93.8967, region: 'Northeast' },
  { iata: 'RPR', name: 'Swami Vivekananda Airport', city: 'Raipur', lat: 21.1804, lon: 81.7388, region: 'Central' },
  { iata: 'VTZ', name: 'Visakhapatnam Airport', city: 'Visakhapatnam', lat: 17.7212, lon: 83.2245, region: 'South' },
  { iata: 'CJB', name: 'Coimbatore International', city: 'Coimbatore', lat: 11.0297, lon: 77.0434, region: 'South' },
];

function city(iata: string): string {
  return fixtureAirports.find((a) => a.iata === iata)?.city ?? iata;
}

function route(
  origin: string,
  destination: string,
  averageFare: number,
  changePct: number,
  observations: number,
  weight: number,
  confidence: number,
  bestBookingWindow: RouteSummary['bestBookingWindow'] = 'T+30',
): RouteSummary {
  const trend = changePct > 2 ? 'rising' : changePct < -2 ? 'falling' : 'stable';
  return {
    origin,
    destination,
    originCity: city(origin),
    destinationCity: city(destination),
    averageFare,
    changePct,
    trend,
    status: trend === 'rising' ? 'Higher than usual' : trend === 'falling' ? 'Lower than usual' : 'Typical',
    typicalRange: [Math.round(averageFare * 0.75), Math.round(averageFare * 1.08)],
    bestBookingWindow,
    observations,
    airlinesMonitored: 6,
    weight,
    confidence,
  };
}

export const fixtureRoutes: RouteSummary[] = [
  route('DEL', 'BOM', 6420, 14.2, 4281, 1, 0.92),
  route('BOM', 'BLR', 4850, 8.1, 3102, 0.85, 0.9),
  route('DEL', 'BLR', 7120, 11.4, 3901, 0.95, 0.91),
  route('HYD', 'MAA', 3980, -7.1, 2104, 0.7, 0.88),
  route('DEL', 'CCU', 5680, 5.3, 2400, 0.75, 0.87),
  route('BOM', 'GOI', 3520, -3.2, 1800, 0.55, 0.85),
  route('BLR', 'MAA', 3200, 1.1, 2600, 0.65, 0.9),
  route('DEL', 'HYD', 5890, 6.8, 2800, 0.8, 0.89),
  route('CCU', 'GAU', 4100, -4.5, 980, 0.4, 0.8),
  route('BOM', 'AMD', 3650, 2.4, 1500, 0.5, 0.86),
  route('DEL', 'PNQ', 4780, 9.2, 1700, 0.6, 0.88),
  route('BLR', 'COK', 3400, -1.8, 1400, 0.45, 0.84),
  route('MAA', 'TRV', 2900, 0.5, 1100, 0.35, 0.82),
  route('DEL', 'JAI', 3100, 3.6, 900, 0.3, 0.83),
  route('BOM', 'HYD', 4200, 4.1, 2200, 0.7, 0.88),
  route('DEL', 'LKO', 3350, -2.1, 1200, 0.4, 0.85),
  route('BLR', 'HYD', 3100, 1.8, 1900, 0.55, 0.87),
  route('CCU', 'BBI', 3600, 2.9, 700, 0.25, 0.78),
  route('DEL', 'SXR', 5800, 7.5, 800, 0.35, 0.8),
  route('BOM', 'COK', 5100, -5.4, 1300, 0.45, 0.86),
];

function trendSeries(base: number): { date: string; fare: number }[] {
  const out = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const wobble = Math.sin(i / 4) * 180 + (30 - i) * 12;
    out.push({
      date: d.toISOString().slice(0, 10),
      fare: Math.round(base - 400 + wobble),
    });
  }
  return out;
}

export function buildExploreFixture(selected?: RouteSummary): ExploreDashboard {
  const sel = selected ?? fixtureRoutes[0];
  return {
    dataState: 'MOCK',
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    nationalChangePct: 6.4,
    summary: {
      risingFastest: fixtureRoutes[0],
      fallingFastest: fixtureRoutes[3],
      bestBookingWindow: 'Around 30 days before departure',
      routesMonitored: 42,
      airportsCovered: 28,
      observations: 184000,
    },
    routes: fixtureRoutes,
    selectedRoute: sel,
    fareTrend: trendSeries(sel.averageFare),
    bookingWindowComparison: [
      { window: 'T+1', label: 'Tomorrow', fare: Math.round(sel.averageFare * 1.35) },
      { window: 'T+7', label: '7 days', fare: Math.round(sel.averageFare * 1.18) },
      { window: 'T+15', label: '15 days', fare: Math.round(sel.averageFare * 1.06) },
      { window: 'T+30', label: '30 days', fare: sel.averageFare },
      { window: 'T+45', label: '45 days', fare: Math.round(sel.averageFare * 1.04) },
    ],
    playback: [
      { period: 'Jan', routes: fixtureRoutes.map((r) => ({ ...r, changePct: r.changePct - 4 })) },
      { period: 'Feb', routes: fixtureRoutes.map((r) => ({ ...r, changePct: r.changePct - 2 })) },
      { period: 'Mar', routes: fixtureRoutes.map((r) => ({ ...r, changePct: r.changePct })) },
      { period: 'Apr', routes: fixtureRoutes.map((r) => ({ ...r, changePct: r.changePct + 1 })) },
      { period: 'May', routes: fixtureRoutes.map((r) => ({ ...r, changePct: r.changePct + 2 })) },
      { period: 'Jun', routes: fixtureRoutes },
    ],
  };
}
