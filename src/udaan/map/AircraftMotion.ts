/** Retained motion helpers adapted from legacy Cesium aircraft interpolation. */

export function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export function norm180(deg: number): number {
  const n = norm360(deg);
  return n > 180 ? n - 360 : n;
}

export function lerpAngleDeg(fromDeg: number, toDeg: number, t: number): number {
  const delta = norm180(toDeg - fromDeg);
  return norm360(fromDeg + delta * t);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export interface MotionSample {
  lat: number;
  lon: number;
  alt: number;
  heading: number;
  t: number;
}

/** Linear interpolate between two samples for smooth local movement between network updates. */
export function interpolateMotion(a: MotionSample, b: MotionSample, now: number): MotionSample {
  const span = Math.max(1, b.t - a.t);
  const t = Math.min(1, Math.max(0, (now - a.t) / span));
  return {
    lat: lerp(a.lat, b.lat, t),
    lon: lerp(a.lon, b.lon, t),
    alt: lerp(a.alt, b.alt, t),
    heading: lerpAngleDeg(a.heading, b.heading, t),
    t: now,
  };
}
