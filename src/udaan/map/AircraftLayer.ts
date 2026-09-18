import * as Cesium from 'cesium';
import type { LiveFlight } from '@udaan/services/types';
import { interpolateMotion, type MotionSample } from './AircraftMotion';

const AIRCRAFT_DS = 'udaan-aircraft';

type Track = {
  prev: MotionSample;
  next: MotionSample;
  entity: Cesium.Entity;
};

const tracks = new Map<string, Track>();

export function clearAircraftLayer(viewer: Cesium.Viewer): void {
  const ds = viewer.dataSources.getByName(AIRCRAFT_DS)[0];
  if (ds) void viewer.dataSources.remove(ds, true);
  tracks.clear();
}

export function upsertAircraftLayer(
  viewer: Cesium.Viewer,
  flights: LiveFlight[],
  selectedId: string | null,
): Cesium.CustomDataSource {
  let ds = viewer.dataSources.getByName(AIRCRAFT_DS)[0] as Cesium.CustomDataSource | undefined;
  if (!ds) {
    ds = new Cesium.CustomDataSource(AIRCRAFT_DS);
    void viewer.dataSources.add(ds);
  }

  const now = Date.now();
  const seen = new Set<string>();

  for (const f of flights) {
    seen.add(f.id);
    const sample: MotionSample = {
      lat: f.lat,
      lon: f.lon,
      alt: f.alt,
      heading: f.heading,
      t: now,
    };
    let track = tracks.get(f.id);
    if (!track) {
      const entity = ds.entities.add({
        id: `ac-${f.id}`,
        name: f.callsign || f.id,
        position: Cesium.Cartesian3.fromDegrees(f.lon, f.lat, f.alt),
        billboard: {
          image: createPlaneCanvas(),
          width: 18,
          height: 18,
          rotation: Cesium.Math.toRadians(-f.heading),
          alignedAxis: Cesium.Cartesian3.UNIT_Z,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        model:
          selectedId === f.id
            ? {
                uri: '/models/aircraft/airplane.glb',
                minimumPixelSize: 48,
                maximumScale: 20000,
                scale: 1,
              }
            : undefined,
        properties: { kind: 'aircraft', id: f.id },
      });
      track = { prev: sample, next: sample, entity };
      tracks.set(f.id, track);
    } else {
      track.prev = track.next;
      track.next = sample;
      if (selectedId === f.id && !track.entity.model) {
        track.entity.model = new Cesium.ModelGraphics({
          uri: '/models/aircraft/airplane.glb',
          minimumPixelSize: 48,
          maximumScale: 20000,
          scale: 1,
        });
      }
    }
  }

  for (const [id, track] of tracks) {
    if (!seen.has(id)) {
      ds.entities.remove(track.entity);
      tracks.delete(id);
    }
  }

  return ds;
}

export function tickAircraftInterpolation(viewer: Cesium.Viewer): void {
  const now = Date.now();
  for (const track of tracks.values()) {
    const m = interpolateMotion(track.prev, track.next, now);
    track.entity.position = new Cesium.ConstantPositionProperty(
      Cesium.Cartesian3.fromDegrees(m.lon, m.lat, m.alt),
    );
    if (track.entity.billboard) {
      track.entity.billboard.rotation = new Cesium.ConstantProperty(
        Cesium.Math.toRadians(-m.heading),
      );
    }
  }
  viewer.scene.requestRender();
}

function createPlaneCanvas(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = 32;
  c.height = 32;
  const ctx = c.getContext('2d')!;
  ctx.translate(16, 16);
  ctx.fillStyle = '#0B1F3A';
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(8, 10);
  ctx.lineTo(0, 6);
  ctx.lineTo(-8, 10);
  ctx.closePath();
  ctx.fill();
  return c;
}
