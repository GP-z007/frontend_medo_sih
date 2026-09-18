import { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import { config } from '@udaan/app/config';
import type { Airport, LiveFlight, RouteSummary } from '@udaan/services/types';
import { upsertAirportLayer } from './AirportLayer';
import { upsertRouteLayer } from './RouteLayer';
import {
  clearAircraftLayer,
  tickAircraftInterpolation,
  upsertAircraftLayer,
} from './AircraftLayer';
import { setIndiaTopDown } from './CameraController';
import { formatInr, formatPct, routeKey } from '@udaan/state/dashboard';
import '@udaan/styles/map.css';

export interface IndiaMapProps {
  airports: Airport[];
  routes: RouteSummary[];
  selectedRouteKey: string | null;
  focusAirport: string | null;
  liveFlightsEnabled: boolean;
  liveFlights: LiveFlight[];
  onSelectRoute: (origin: string, destination: string) => void;
  onSelectAirport: (iata: string) => void;
}

export function IndiaMap({
  airports,
  routes,
  selectedRouteKey,
  focusAirport,
  liveFlightsEnabled,
  liveFlights,
  onSelectRoute,
  onSelectAirport,
}: IndiaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const propsRef = useRef({
    airports,
    routes,
    selectedRouteKey,
    focusAirport,
    onSelectRoute,
    onSelectAirport,
  });
  propsRef.current = {
    airports,
    routes,
    selectedRouteKey,
    focusAirport,
    onSelectRoute,
    onSelectAirport,
  };
  const hoveredRef = useRef<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    lines: string[];
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;
    if (config.cesiumIonToken) {
      Cesium.Ion.defaultAccessToken = config.cesiumIonToken;
    }

    const viewer = new Cesium.Viewer(containerRef.current, {
      timeline: false,
      animation: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      vrButton: false,
      selectionIndicator: false,
      infoBox: false,
      baseLayer: false,
    });

    viewer.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        credit: '© OpenStreetMap contributors',
      }),
    );

    viewer.scene.globe.enableLighting = false;
    viewer.scene.fog.enabled = false;
    viewer.scene.skyAtmosphere.show = false;
    viewer.scene.sun.show = false;
    viewer.scene.moon.show = false;
    viewer.scene.skyBox.show = false;
    viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#E8E4DE');
    viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#D9D4CC');
    viewer.targetFrameRate = 60;
    viewer.scene.requestRenderMode = true;
    viewer.scene.maximumRenderTimeChange = Infinity;

    setIndiaTopDown(viewer);
    viewerRef.current = viewer;

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    const paintRoutes = (hoveredKey: string | null) => {
      const p = propsRef.current;
      const ends = p.selectedRouteKey ? p.selectedRouteKey.split('-') : [];
      upsertAirportLayer(viewer, p.airports, p.focusAirport, ends);
      upsertRouteLayer(viewer, p.routes, p.airports, p.selectedRouteKey, p.focusAirport, hoveredKey);
      viewer.scene.requestRender();
    };

    handler.setInputAction((movement: { endPosition: Cesium.Cartesian2 }) => {
      const picked = viewer.scene.pick(movement.endPosition);
      if (!Cesium.defined(picked) || !picked.id?.properties) {
        setTooltip(null);
        if (hoveredRef.current) {
          hoveredRef.current = null;
          paintRoutes(null);
        }
        return;
      }
      const props = picked.id.properties;
      const kind = props.kind?.getValue?.() ?? props.kind;
      if (kind === 'route') {
        const origin = String(props.origin?.getValue?.() ?? props.origin);
        const destination = String(props.destination?.getValue?.() ?? props.destination);
        const fare = Number(props.averageFare?.getValue?.() ?? props.averageFare);
        const change = Number(props.changePct?.getValue?.() ?? props.changePct);
        const obs = Number(props.observations?.getValue?.() ?? props.observations);
        const key = `${origin}-${destination}`;
        setTooltip({
          x: movement.endPosition.x,
          y: movement.endPosition.y,
          lines: [
            `${origin} → ${destination}`,
            formatInr(fare),
            formatPct(change),
            `${obs.toLocaleString('en-IN')} price observations`,
          ],
        });
        if (hoveredRef.current !== key) {
          hoveredRef.current = key;
          paintRoutes(key);
        } else {
          viewer.scene.requestRender();
        }
      } else {
        setTooltip(null);
        if (hoveredRef.current) {
          hoveredRef.current = null;
          paintRoutes(null);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction((click: { position: Cesium.Cartesian2 }) => {
      const picked = viewer.scene.pick(click.position);
      if (!Cesium.defined(picked) || !picked.id?.properties) return;
      const props = picked.id.properties;
      const kind = props.kind?.getValue?.() ?? props.kind;
      const p = propsRef.current;
      if (kind === 'route') {
        p.onSelectRoute(
          String(props.origin?.getValue?.() ?? props.origin),
          String(props.destination?.getValue?.() ?? props.destination),
        );
      } else if (kind === 'airport') {
        p.onSelectAirport(String(props.iata?.getValue?.() ?? props.iata));
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.destroy();
      clearAircraftLayer(viewer);
      viewer.destroy();
      viewerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed()) return;
    const ends = selectedRouteKey ? selectedRouteKey.split('-') : [];
    upsertAirportLayer(viewer, airports, focusAirport, ends);
    upsertRouteLayer(
      viewer,
      routes,
      airports,
      selectedRouteKey,
      focusAirport,
      hoveredRef.current,
    );
    viewer.scene.requestRender();
  }, [airports, routes, selectedRouteKey, focusAirport]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed()) return;
    if (!liveFlightsEnabled) {
      clearAircraftLayer(viewer);
      viewer.scene.requestRender();
      return;
    }
    upsertAircraftLayer(viewer, liveFlights, null);
    let raf = 0;
    const loop = () => {
      tickAircraftInterpolation(viewer);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [liveFlightsEnabled, liveFlights]);

  return (
    <div className="map-stage">
      <div ref={containerRef} className="udaan-cesium-root" />
      {tooltip && (
        <div className="udaan-map-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.lines.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export { routeKey };
