import * as Cesium from 'cesium';

export const INDIA_CENTER = {
  lon: 78.9629,
  lat: 22.5937,
  height: 3_650_000,
};

export function flyToIndia(viewer: Cesium.Viewer, duration = 1.6): void {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      INDIA_CENTER.lon,
      INDIA_CENTER.lat,
      INDIA_CENTER.height,
    ),
    orientation: {
      heading: 0,
      pitch: Cesium.Math.toRadians(-90),
      roll: 0,
    },
    duration,
  });
}

export function setIndiaTopDown(viewer: Cesium.Viewer): void {
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(
      INDIA_CENTER.lon,
      INDIA_CENTER.lat,
      INDIA_CENTER.height,
    ),
    orientation: {
      heading: 0,
      pitch: Cesium.Math.toRadians(-90),
      roll: 0,
    },
  });
}

export function flyToAirport(
  viewer: Cesium.Viewer,
  lon: number,
  lat: number,
  height = 900_000,
): void {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
    orientation: {
      heading: 0,
      pitch: Cesium.Math.toRadians(-85),
      roll: 0,
    },
    duration: 1.2,
  });
}
