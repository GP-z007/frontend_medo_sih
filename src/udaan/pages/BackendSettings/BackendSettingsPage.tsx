import { useState } from 'react';
import { config } from '@udaan/app/config';
import { getHealth } from '@udaan/services/health';

export default function BackendSettingsPage() {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{
    status: 'Connected' | 'Unavailable' | 'Checking';
    latencyMs?: number;
    version?: string;
    database?: string;
    api?: string;
    endpoint?: string;
    lastCheck?: string;
  }>({ status: 'Unavailable' });

  async function testConnection() {
    setChecking(true);
    setResult((r) => ({ ...r, status: 'Checking' }));
    const health = await getHealth();
    setResult({
      status: health.ok ? 'Connected' : 'Unavailable',
      latencyMs: health.latencyMs,
      version: health.version,
      database: health.database,
      api: health.api,
      endpoint: health.endpoint,
      lastCheck: new Date().toLocaleString('en-IN'),
    });
    setChecking(false);
  }

  return (
    <div className="backend-page">
      <div className="udaan-panel">
      <h1 style={{ fontSize: 20, marginBottom: 6 }}>Backend settings</h1>
      <p style={{ color: 'var(--udaan-text-muted)', fontSize: 14 }}>
        Environment configuration is the source of truth. Changing{' '}
        <code>VITE_UDAAN_*</code> values requires a restart of the Vite dev server (or rebuild).
      </p>

      <dl>
        <dt>API Base URL</dt>
        <dd>
          <code>{config.apiBaseUrl}</code>
        </dd>
        <dt>Mock data</dt>
        <dd>{config.useMockData ? 'Enabled (VITE_UDAAN_USE_MOCK_DATA=true)' : 'Disabled'}</dd>
        <dt>Browser URL</dt>
        <dd>
          <code>{config.browserUrl}</code>
        </dd>
        <dt>Connection status</dt>
        <dd>
          <strong
            style={{
              color:
                result.status === 'Connected'
                  ? 'var(--udaan-falling)'
                  : result.status === 'Checking'
                    ? 'var(--udaan-stable)'
                    : 'var(--udaan-rising)',
            }}
          >
            {result.status}
          </strong>
        </dd>
        <dt>Health endpoint</dt>
        <dd>
          <code>{result.endpoint ?? `${config.apiBaseUrl}/health`}</code>
        </dd>
        <dt>Response latency</dt>
        <dd>{result.latencyMs != null ? `${result.latencyMs} ms` : '—'}</dd>
        <dt>Backend version</dt>
        <dd>{result.version ?? '—'}</dd>
        <dt>Database status</dt>
        <dd>{result.database ?? '—'}</dd>
        <dt>API status</dt>
        <dd>{result.api ?? result.status}</dd>
        <dt>Last successful check</dt>
        <dd>{result.status === 'Connected' ? result.lastCheck : result.lastCheck ?? '—'}</dd>
      </dl>

      <button type="button" className="btn-primary" disabled={checking} onClick={() => void testConnection()}>
        {checking ? 'Testing…' : 'Test connection'}
      </button>
      </div>
    </div>
  );
}
