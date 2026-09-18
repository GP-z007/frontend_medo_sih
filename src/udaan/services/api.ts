import { config } from '@udaan/app/config';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public path: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<T> {
  const base = config.apiBaseUrl.replace(/\/$/, '');
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), init?.timeoutMs ?? 12000);

  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(init?.headers || {}),
      },
    });
    if (!res.ok) {
      throw new ApiError(`Request failed (${res.status})`, res.status, path);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

/** Try /api/v1/health then origin /health */
export async function fetchHealth(): Promise<{
  ok: boolean;
  latencyMs: number;
  body: Record<string, unknown> | null;
  endpoint: string;
}> {
  const base = config.apiBaseUrl.replace(/\/$/, '');
  const candidates = [`${base}/health`];
  try {
    const origin = new URL(base).origin;
    candidates.push(`${origin}/health`);
  } catch {
    /* ignore */
  }

  const started = performance.now();
  for (const endpoint of candidates) {
    try {
      const res = await fetch(endpoint, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(8000),
      });
      const latencyMs = Math.round(performance.now() - started);
      if (!res.ok) continue;
      let body: Record<string, unknown> | null = null;
      try {
        body = (await res.json()) as Record<string, unknown>;
      } catch {
        body = { status: 'ok' };
      }
      return { ok: true, latencyMs, body, endpoint };
    } catch {
      /* try next */
    }
  }
  return {
    ok: false,
    latencyMs: Math.round(performance.now() - started),
    body: null,
    endpoint: candidates[0],
  };
}
