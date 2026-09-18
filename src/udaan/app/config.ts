/** Central UDAAN configuration — do not scatter import.meta.env in components. */

function env(key: string, fallback = ''): string {
  const value = (import.meta.env as Record<string, string | undefined>)[key];
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function envBool(key: string, fallback: boolean): boolean {
  const raw = env(key, '');
  if (!raw) return fallback;
  return raw === 'true' || raw === '1';
}

export const config = {
  apiBaseUrl: env('VITE_UDAAN_API_BASE_URL', 'http://localhost:8000/api/v1'),
  browserUrl: env(
    'VITE_UDAAN_BROWSER_URL',
    'http://localhost:6080/vnc.html?autoconnect=1&resize=scale',
  ),
  useMockData: envBool('VITE_UDAAN_USE_MOCK_DATA', true),
  cesiumIonToken: env('VITE_CESIUM_ION_TOKEN', ''),
  appName: 'UDAAN',
  appTagline: 'National Airfare Intelligence',
  buildVersion: env('VITE_UDAAN_BUILD', '1.0.0'),
} as const;

export type UdaanConfig = typeof config;
