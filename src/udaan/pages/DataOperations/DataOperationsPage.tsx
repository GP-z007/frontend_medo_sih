import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHealth, getSystemStatus } from '@udaan/services/health';
import type { SystemStatus } from '@udaan/services/types';
import { config } from '@udaan/app/config';
import { relativeUpdated } from '@udaan/state/dashboard';

function statusTone(status: string): 'ok' | 'warn' | 'bad' {
  const s = status.toLowerCase();
  if (s.includes('delay') || s.includes('degraded') || s.includes('idle')) return 'warn';
  if (s.includes('fail') || s.includes('down') || s.includes('unavail')) return 'bad';
  return 'ok';
}

export default function DataOperationsPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [backend, setBackend] = useState<'Connected' | 'Unavailable' | 'Checking'>('Checking');

  useEffect(() => {
    void getSystemStatus().then(setStatus);
    void getHealth().then((h) => setBackend(h.ok ? 'Connected' : 'Unavailable'));
  }, []);

  if (!status) {
    return (
      <div className="ops-page">
        <div className="udaan-panel">Loading Data Operations…</div>
      </div>
    );
  }

  const environment = import.meta.env.DEV || config.useMockData ? 'Development' : 'Production';
  const dataSource = config.useMockData ? 'Mock' : status.dataState === 'LIVE' ? 'Live' : status.dataState;
  const scrape = status.browserAgent;
  const browserLabel = scrape.browserConnected ? 'Connected' : 'Not reported';

  return (
    <div className="ops-page">
      <div className="page-header">
        <div>
          <h1>Data Operations</h1>
          <p className="lede">Ingestion health, pipeline status and live scrape activity</p>
        </div>
        <div>
          {status.dataState === 'MOCK' && <span className="badge-mock">MOCK</span>}
          <div style={{ fontSize: 11, color: 'var(--udaan-text-muted)', marginTop: 4 }}>
            {relativeUpdated(status.updatedAt)}
          </div>
        </div>
      </div>

      <section className="udaan-panel">
        <div className="micro-label">Data sources</div>
        <table className="ops-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Status</th>
              <th>Last update</th>
              <th>Records</th>
            </tr>
          </thead>
          <tbody>
            {status.sources.map((s) => {
              const tone = statusTone(s.status);
              return (
                <tr key={s.name}>
                  <td>{s.name}</td>
                  <td>
                    <span className={`status-dot ${tone}`} />
                    <span className={`status-text ${tone}`}>{s.status}</span>
                  </td>
                  <td>{s.lastUpdate ?? status.lastScrapeAgo}</td>
                  <td>{s.records != null ? s.records.toLocaleString('en-IN') : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <div className="ops-split">
        <section className="udaan-panel">
          <div className="micro-label">Pipeline</div>
          <table className="ops-table">
            <tbody>
              <tr>
                <td>Scraper workers</td>
                <td>
                  {status.scrapingAgents.online} / {status.scrapingAgents.total}
                </td>
              </tr>
              <tr>
                <td>PostgreSQL</td>
                <td>
                  <span className={`status-dot ${statusTone(status.postgresql)}`} />
                  <span className={`status-text ${statusTone(status.postgresql)}`}>
                    {status.postgresql}
                  </span>
                </td>
              </tr>
              <tr>
                <td>Math engine</td>
                <td>
                  <span className={`status-dot ${statusTone(status.mathEngine)}`} />
                  <span className={`status-text ${statusTone(status.mathEngine)}`}>
                    {status.mathEngine}
                  </span>
                </td>
              </tr>
              <tr>
                <td>Browser agent</td>
                <td>
                  <span className={`status-dot ${statusTone(scrape.status)}`} />
                  <span className={`status-text ${statusTone(scrape.status)}`}>{scrape.status}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="udaan-panel">
          <div className="micro-label">Current scrape</div>
          <table className="ops-table">
            <tbody>
              <tr>
                <td>Source</td>
                <td>{scrape.source ?? '—'}</td>
              </tr>
              <tr>
                <td>Route</td>
                <td>{scrape.route ?? '—'}</td>
              </tr>
              <tr>
                <td>Stage</td>
                <td>{scrape.stage ?? '—'}</td>
              </tr>
              <tr>
                <td>Records</td>
                <td>
                  {scrape.recordsThisTask != null
                    ? scrape.recordsThisTask.toLocaleString('en-IN')
                    : '—'}
                </td>
              </tr>
            </tbody>
          </table>
          <Link to="/explore?view=browser" className="btn-primary" style={{ marginTop: 12 }}>
            View live browser
          </Link>
        </section>
      </div>

      <div className="ops-split">
        <section className="udaan-panel" id="ops-system">
          <div className="micro-label">System</div>
          <table className="ops-table">
            <tbody>
              <tr>
                <td>Environment</td>
                <td>{environment}</td>
              </tr>
              <tr>
                <td>Frontend</td>
                <td>
                  <span className="status-dot ok" />
                  <span className="status-text ok">Connected</span>
                </td>
              </tr>
              <tr>
                <td>Backend</td>
                <td>
                  <span className={`status-dot ${backend === 'Connected' ? 'ok' : 'warn'}`} />
                  <span className={`status-text ${backend === 'Connected' ? 'ok' : 'warn'}`}>
                    {backend}
                  </span>
                </td>
              </tr>
              <tr>
                <td>Scraper browser</td>
                <td>
                  <span className={`status-dot ${scrape.browserConnected ? 'ok' : 'warn'}`} />
                  <span className={`status-text ${scrape.browserConnected ? 'ok' : 'warn'}`}>
                    {browserLabel}
                  </span>
                </td>
              </tr>
              <tr>
                <td>Data source</td>
                <td>{dataSource}</td>
              </tr>
              <tr>
                <td>Build</td>
                <td>{config.buildVersion}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="udaan-panel">
          <div className="micro-label">Administration</div>
          <div className="ops-admin-links">
            <Link to="/settings/backend">Backend settings →</Link>
            <Link to="/explore?view=browser">Browser connection →</Link>
            <a href="#ops-diagnostics">System diagnostics →</a>
          </div>
        </section>
      </div>

      <section className="udaan-panel" id="ops-diagnostics">
        <div className="micro-label">System diagnostics</div>
        <table className="ops-table">
          <thead>
            <tr>
              <th>Check</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Last scrape</td>
              <td>{status.lastScrapeAgo}</td>
            </tr>
            <tr>
              <td>Records today</td>
              <td>{status.recordsToday.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>Rejected</td>
              <td>{status.rejected.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>Duplicates</td>
              <td>{status.duplicates.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>Outliers</td>
              <td>{status.outliers.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>API base</td>
              <td>{config.apiBaseUrl}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
