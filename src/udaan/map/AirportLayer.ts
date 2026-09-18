import * as Cesium from 'cesium';
import type { Airport } from '@udaan/services/types';

const AIRPORT_DS = 'udaan-airports';

const HUBS = new Set([
  'DEL',
  'BOM',
  'BLR',
  'MAA',
  'HYD',
  'CCU',
  'AMD',
  'PNQ',
  'COK',
  'GAU',
]);

export function upsertAirportLayer(
  viewer: Cesium.Viewer,
  airports: Airport[],
  highlightedIata: string | null,
  selectedEnds: string[] = [],
): Cesium.CustomDataSource {
  let ds = viewer.dataSources.getByName(AIRPORT_DS)[0] as Cesium.CustomDataSource | undefined;
  if (!ds) {
    ds = new Cesium.CustomDataSource(AIRPORT_DS);
    void viewer.dataSources.add(ds);
  }
  ds.entities.removeAll();
  const ends = new Set(selectedEnds);

  for (const a of airports) {
    const selected = highlightedIata === a.iata || ends.has(a.iata);
    const hub = HUBS.has(a.iata);
    const showLabel = hub || selected;

    ds.entities.add({
      id: `airport-${a.iata}`,
      name: a.iata,
      position: Cesium.Cartesian3.fromDegrees(a.lon, a.lat, 0),
      point: {
        pixelSize: selected ? 11 : hub ? 7 : 5,
        color: selected
          ? Cesium.Color.fromCssColorString('#E85D04')
          : Cesium.Color.fromCssColorString('#0B1F3A'),
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: selected ? 2 : 1.5,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
      label: {
        text: a.iata,
        font: hub || selected ? '11px sans-serif' : '10px sans-serif',
        fillColor: Cesium.Color.fromCssColorString('#0B1F3A'),
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 3,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new Cesium.Cartesian2(0, -14),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        show: showLabel,
      },
      properties: {
        kind: 'airport',
        iata: a.iata,
      },
    });
  }
  return ds;
}
