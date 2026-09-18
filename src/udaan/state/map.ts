/** Map UI state helpers for UDAAN. */

export type MapInteraction = {
  selectedRouteKey: string | null;
  focusAirport: string | null;
  liveFlightsEnabled: boolean;
  playbackIndex: number;
};

export const defaultMapInteraction: MapInteraction = {
  selectedRouteKey: null,
  focusAirport: null,
  liveFlightsEnabled: false,
  playbackIndex: 0,
};
