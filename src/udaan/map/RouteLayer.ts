import * as Cesium from 'cesium';
import type { Airport, RouteSummary } from '@udaan/services/types';

const ROUTE_DS = 'udaan-routes';

type RouteRole = 'selected' | 'hovered' | 'connected' | 'dimmed' | 'default';

function trendColor(trend: RouteSummary['trend'], role: RouteRole): Cesium.Color {
  if (role === 'selected') {
    return Cesium.Color.fromCssColorString('#E86720').withAlpha(0.98);
  }
  const base =
    trend === 'rising'
      ? Cesium.Color.fromCssColorString('#C2410C')
      : trend === 'falling'
        ? Cesium.Color.fromCssColorString('#2F6F4E')
        : Cesium.Color.fromCssColorString('#64748B');
  if (role === 'hovered') return base.withAlpha(0.88);
  if (role === 'connected') return base.withAlpha(0.66);
  if (role === 'dimmed') return base.withAlpha(0.14);
  return base.withAlpha(0.4);
}

function routeWidth(weight: number, role: RouteRole): number {
  if (role === 'selected') return 3.6;
  if (role === 'hovered') return 2.2;
  if (role === 'connected') return 1.55;
  if (role === 'dimmed') return 0.9;
  return 0.95 + weight * 0.35;
}

function routeRole(
  key: string,
  selectedKey: string | null,
  focusAirport: string | null,
  hoveredKey: string | null,
  origin: string,
  destination: string,
): RouteRole {
  if (selectedKey === key) return 'selected';
  if (hoveredKey === key) return 'hovered';
  const selectedEnds = selectedKey ? selectedKey.split('-') : [];
  const connectedToSelected =
    selectedEnds.length === 2 &&
    (origin === selectedEnds[0] ||
      origin === selectedEnds[1] ||
      destination === selectedEnds[0] ||
      destination === selectedEnds[1]);
  const connectedToAirport =
    Boolean(focusAirport) && (origin === focusAirport || destination === focusAirport);
  if (connectedToSelected || connectedToAirport) return 'connected';
  if (selectedKey || focusAirport) return 'dimmed';
  return 'default';
}

function arcPositions(a: Airport, b: Airport, segments = 48): Cesium.Cartesian3[] {
  const positions: Cesium.Cartesian3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const lon = a.lon + (b.lon - a.lon) * t;
    const lat = a.lat + (b.lat - a.lat) * t;
    const bulge = Math.sin(Math.PI * t) * 120_000;
    positions.push(Cesium.Cartesian3.fromDegrees(lon, lat, bulge));
  }
  return positions;
}

export function upsertRouteLayer(
  viewer: Cesium.Viewer,
  routes: RouteSummary[],
  airports: Airport[],
  selectedKey: string | null,
  focusAirport: string | null,
  hoveredKey: string | null = null,
): Cesium.CustomDataSource {
  let ds = viewer.dataSources.getByName(ROUTE_DS)[0] as Cesium.CustomDataSource | undefined;
  if (!ds) {
    ds = new Cesium.CustomDataSource(ROUTE_DS);
    void viewer.dataSources.add(ds);
  }
  ds.entities.removeAll();
  const byIata = new Map(airports.map((a) => [a.iata, a]));

  for (const r of routes) {
    const origin = byIata.get(r.origin);
    const dest = byIata.get(r.destination);
    if (!origin || !dest) continue;
    const key = `${r.origin}-${r.destination}`;
    const role = routeRole(key, selectedKey, focusAirport, hoveredKey, r.origin, r.destination);

    ds.entities.add({
      id: `route-${key}`,
      name: key,
      polyline: {
        positions: arcPositions(origin, dest),
        width: routeWidth(r.weight, role),
        material: trendColor(r.trend, role),
        clampToGround: false,
      },
      properties: {
        kind: 'route',
        origin: r.origin,
        destination: r.destination,
        averageFare: r.averageFare,
        changePct: r.changePct,
        observations: r.observations,
      },
    });
  }
  return ds;
}
