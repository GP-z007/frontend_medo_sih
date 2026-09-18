import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAnalyticsDashboard } from '@udaan/services/analytics';
import { exportAnalytics } from '@udaan/services/health';
import type { AnalyticsDashboard, AnalyticsFilters } from '@udaan/services/types';
import {
  AirlineMovementChart,
  BookingWindowChart,
  IndexTrendChart,
  IndexVsCpiChart,
  RisingRoutesChart,
} from '@udaan/components/charts/Charts';
import { formatInr, formatPct, relativeUpdated } from '@udaan/state/dashboard';
import { config } from '@udaan/app/config';

const initialFilters: AnalyticsFilters = {
  range: '6m',
  region: 'all-india',
  route: 'all',
  airline: 'all',
  bookingWindow: 'all',
  fareType: 'economy',
};

export default function AnalyticsPage() {
  const [params] = useSearchParams();
  const routeFromExplore = params.get('route') || 'all';
  const seeded: AnalyticsFilters = {
    ...initialFilters,
    route: routeFromExplore,
  };
  const [filters, setFilters] = useState<AnalyticsFilters>(seeded);
  const [draft, setDraft] = useState<AnalyticsFilters>(seeded);
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [exportMsg, setExportMsg] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void getAnalyticsDashboard(filters).then((d) => {
      if (!cancelled) setData(d);
    });
    return () => {
      cancelled = true;
    };
  }, [filters]);

  async function onExport(format: 'csv' | 'xlsx' | 'json') {
    const result = await exportAnalytics(format, filters);
    setExportMsg(result.message);
    if (result.blob) {
      const url = URL.createObjectURL(result.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `udaan-analytics.${format === 'xlsx' ? 'json' : format}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  if (!data) return <div className="udaan-panel">Loading Analytics…</div>;

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div>
          <h1>Airfare Analytics for India</h1>
          <p className="lede">
            Deeper investigation of national airfare trends, route contribution and booking windows
          </p>
        </div>
        <div className="page-header-actions">
          {config.useMockData && <span className="badge-mock">MOCK</span>}
          <span style={{ fontSize: 11, color: 'var(--udaan-text-muted)' }}>
            {relativeUpdated(data.updatedAt)}
          </span>
          <button type="button" className="btn-secondary filters-open-btn" onClick={() => setFiltersOpen(true)}>
            Filters
          </button>
          <button type="button" className="btn-secondary" onClick={() => void onExport('csv')}>
            Export CSV
          </button>
          <button type="button" className="btn-secondary" onClick={() => void onExport('json')}>
            Export JSON
          </button>
        </div>
      </div>
      {exportMsg && (
        <p style={{ fontSize: 11, color: 'var(--udaan-text-muted)' }}>{exportMsg}</p>
      )}

      <div className="analytics-layout">
        <div>
          <div className="metric-strip">
            <div className="cell">
              <div className="label">National Airfare Index</div>
              <div className="value mono">{data.nationalAirfareIndex.toFixed(1)}</div>
              <div className="sub" style={{ color: 'var(--udaan-text-muted)' }}>
                {data.indexBase}
              </div>
            </div>
            <div className="cell">
              <div className="label">Average Fare</div>
              <div className="value mono">{formatInr(data.averageFare)}</div>
            </div>
            <div className="cell">
              <div className="label">MoM Change</div>
              <div className={`value mono metric-delta ${data.momChangePct >= 0 ? 'up' : 'down'}`}>
                {formatPct(data.momChangePct)}
              </div>
            </div>
            <div className="cell">
              <div className="label">YoY Change</div>
              <div className={`value mono metric-delta ${data.yoyChangePct >= 0 ? 'up' : 'down'}`}>
                {formatPct(data.yoyChangePct)}
              </div>
            </div>
            <div className="cell">
              <div className="label">Routes tracked</div>
              <div className="value mono">{data.routesMonitored}</div>
            </div>
            <div className="cell">
              <div className="label">Price observations</div>
              <div className="value mono">{data.totalObservations.toLocaleString('en-IN')}</div>
              <div className="sub" style={{ color: 'var(--udaan-text-muted)' }}>
                {data.airportsCovered} airports
              </div>
            </div>
          </div>

          <div className="analytics-charts">
            <IndexTrendChart data={data.indexTrend} />
            <RisingRoutesChart data={data.topRisingRoutes} />
            <BookingWindowChart
              data={data.bookingWindowAverages}
              title="Average fare by booking window"
            />
            <AirlineMovementChart data={data.airlineMovement} />
            <div style={{ gridColumn: '1 / -1' }}>
              <IndexVsCpiChart data={data.indexVsCpi} />
            </div>
          </div>

          <div className="udaan-panel insights-panel" style={{ marginTop: 12 }}>
            <div className="micro-label">Key Insights</div>
            <ul>
              {data.keyInsights.map((insight) => (
                <li key={insight}>{insight}</li>
              ))}
            </ul>
          </div>
        </div>

        <aside className={`udaan-panel filter-panel ${filtersOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="micro-label" style={{ margin: 0 }}>
              Filters
            </div>
            <button type="button" className="btn-secondary filter-dismiss" onClick={() => setFiltersOpen(false)}>
              Close
            </button>
          </div>
          <label>
            Date range
            <select
              value={draft.range}
              onChange={(e) =>
                setDraft({ ...draft, range: e.target.value as AnalyticsFilters['range'] })
              }
            >
              <option value="30d">30 days</option>
              <option value="6m">6 months</option>
              <option value="1y">1 year</option>
            </select>
          </label>
          <label>
            Region
            <select
              value={draft.region}
              onChange={(e) => setDraft({ ...draft, region: e.target.value })}
            >
              <option value="all-india">All India</option>
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="west">West</option>
              <option value="east">East</option>
            </select>
          </label>
          <label>
            Route
            <select
              value={draft.route}
              onChange={(e) => setDraft({ ...draft, route: e.target.value })}
            >
              <option value="all">All routes</option>
              <option value="DEL-BOM">DEL → BOM</option>
              <option value="DEL-BLR">DEL → BLR</option>
              <option value="HYD-MAA">HYD → MAA</option>
            </select>
          </label>
          <label>
            Airline
            <select
              value={draft.airline}
              onChange={(e) => setDraft({ ...draft, airline: e.target.value })}
            >
              <option value="all">All airlines</option>
              <option value="indigo">IndiGo</option>
              <option value="air-india">Air India</option>
              <option value="akasa">Akasa Air</option>
              <option value="spicejet">SpiceJet</option>
            </select>
          </label>
          <label>
            Booking window
            <select
              value={draft.bookingWindow}
              onChange={(e) => setDraft({ ...draft, bookingWindow: e.target.value })}
            >
              <option value="all">All</option>
              <option value="T+1">T+1</option>
              <option value="T+7">T+7</option>
              <option value="T+15">T+15</option>
              <option value="T+30">T+30</option>
              <option value="T+45">T+45</option>
            </select>
          </label>
          <label>
            Fare type
            <select
              value={draft.fareType}
              onChange={(e) => setDraft({ ...draft, fareType: e.target.value })}
            >
              <option value="economy">Economy</option>
              <option value="business">Business</option>
            </select>
          </label>
          <button
            type="button"
            className="btn-primary"
            style={{ marginTop: 12 }}
            onClick={() => {
              setFilters(draft);
              setFiltersOpen(false);
            }}
          >
            Apply filters
          </button>
        </aside>
      </div>
    </div>
  );
}
