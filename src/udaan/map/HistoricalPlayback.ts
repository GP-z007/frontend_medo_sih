import type { RouteSummary } from '@udaan/services/types';

export interface PlaybackFrame {
  period: string;
  routes: RouteSummary[];
}

export function applyPlaybackFrame(
  frames: PlaybackFrame[],
  index: number,
): { period: string; routes: RouteSummary[] } | null {
  if (!frames.length) return null;
  const i = Math.max(0, Math.min(frames.length - 1, index));
  return frames[i];
}
