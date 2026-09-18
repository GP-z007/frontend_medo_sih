import { useCallback, useEffect, useRef, useState } from 'react';
import { config } from '@udaan/app/config';
import type { ScraperStatus } from '@udaan/services/types';
import { getScraperStatus } from '@udaan/services/health';

interface Props {
  active: boolean;
}

export function ScraperBrowserPanel({ active }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [status, setStatus] = useState<ScraperStatus | null>(null);
  const [loadedOnce, setLoadedOnce] = useState(false);

  useEffect(() => {
    if (!active) return;
    setLoadedOnce(true);
    setLoading(true);
    setFailed(false);
    let cancelled = false;
    void getScraperStatus().then((s) => {
      if (!cancelled) setStatus(s);
    });
    return () => {
      cancelled = true;
    };
  }, [active, iframeKey]);

  const refresh = useCallback(() => {
    setIframeKey((k) => k + 1);
    setLoading(true);
    setFailed(false);
  }, []);

  const fullscreen = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen();
  }, []);

  if (!active && !loadedOnce) {
    return null;
  }

  const showFrame = active;
  const statusUnavailable =
    !status ||
    status.status === 'idle' ||
    (!status.source && !status.route && !status.stage);

  return (
    <div
      className="browser-panel"
      style={{ display: showFrame ? 'flex' : 'none' }}
      ref={wrapRef}
    >
      <div className="browser-panel-header">
        <div>
          <h3>Live Scraper Browser</h3>
          <div className="browser-status">
            <span className={`dot ${failed ? '' : 'on'}`} />
            {failed ? 'Unavailable' : loading ? 'Connecting…' : 'Session active'}
          </div>
        </div>
        <div className="browser-actions">
          <button type="button" onClick={refresh}>
            Refresh
          </button>
          <button type="button" onClick={refresh}>
            Reconnect
          </button>
          <button type="button" onClick={fullscreen}>
            Fullscreen
          </button>
          <a
            className="btn-secondary"
            href={config.browserUrl}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >
            Open externally
          </a>
        </div>
      </div>

      <div className="browser-frame-wrap">
        {showFrame && (
          <iframe
            key={iframeKey}
            src={config.browserUrl}
            title="UDAAN Live Scraper Browser"
            allow="clipboard-read; clipboard-write"
            referrerPolicy="no-referrer"
            onLoad={() => {
              setLoading(false);
              setFailed(false);
            }}
            onError={() => {
              setLoading(false);
              setFailed(true);
            }}
          />
        )}
        {loading && (
          <div className="browser-overlay">
            <div>
              <strong>Live Scraper Browser</strong>
              <p>Connecting to browser session…</p>
            </div>
          </div>
        )}
        {failed && (
          <div className="browser-overlay">
            <div>
              <strong>Browser session unavailable</strong>
              <p>Expected browser service: {new URL(config.browserUrl, window.location.origin).origin}</p>
              <button type="button" className="btn-secondary" onClick={refresh} style={{ marginTop: 12 }}>
                Retry
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="browser-activity">
        {statusUnavailable ? (
          <span>DEVELOPMENT / STATUS UNAVAILABLE</span>
        ) : (
          <>
            <span>● {status?.status?.toUpperCase()}</span>
            <span>{status?.source}</span>
            <span>{status?.route?.replace('-', ' → ')}</span>
            <span>{status?.stage}</span>
            {status?.records_collected != null && (
              <span>{status.records_collected} records collected</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
