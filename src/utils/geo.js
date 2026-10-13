const EARTH_RADIUS_KM = 6371;
// Roads are longer than straight lines; a simple multiplier gives a rough
// road-distance estimate. This is an approximation, not a routed distance.
export const ROAD_FACTOR = 1.3;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/** Great-circle distance in km between two {lat, lon} points. */
export function haversineKm(a, b) {
  if (!a || !b || ![a.lat, a.lon, b.lat, b.lon].every(Number.isFinite)) return null;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(s));
}

/** Approximate road distance in km, rounded to the nearest 5 km. */
export function roadKm(a, b) {
  const d = haversineKm(a, b);
  if (d === null) return null;
  return Math.round((d * ROAD_FACTOR) / 5) * 5;
}
