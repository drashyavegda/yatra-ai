import { describe, it, expect } from 'vitest';
import { loadTrips, saveTrip, deleteTrip, clearTrips, isStorageAvailable, STORAGE_KEY } from '../src/utils/storage.js';

function memoryStorage(initial = {}) {
  const m = new Map(Object.entries(initial));
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}
const trip = { id: 'trip-1', days: [{ day: 1 }], budget: { total: 1 }, title: 't' };

describe('storage', () => {
  it('returns [] for corrupted JSON', () => {
    expect(loadTrips(memoryStorage({ [STORAGE_KEY]: '{not json' }))).toEqual([]);
  });
  it('filters non-trip entries', () => {
    const s = memoryStorage({ [STORAGE_KEY]: JSON.stringify([trip, { nope: true }, 5, null]) });
    expect(loadTrips(s)).toHaveLength(1);
  });
  it('saves, dedupes, deletes and clears', () => {
    const s = memoryStorage();
    expect(saveTrip(trip, s).ok).toBe(true);
    expect(saveTrip(trip, s).trips).toHaveLength(1);
    expect(saveTrip({ ...trip, id: 'trip-2' }, s).trips).toHaveLength(2);
    expect(deleteTrip('trip-1', s).trips.map((t) => t.id)).toEqual(['trip-2']);
    expect(clearTrips(s).trips).toEqual([]);
    expect(loadTrips(s)).toEqual([]);
  });
  it('rejects incomplete trips', () => {
    expect(saveTrip({ id: 'x' }, memoryStorage()).ok).toBe(false);
  });
  it('does not throw when storage is unavailable', () => {
    const broken = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); }, removeItem: () => { throw new Error('blocked'); } };
    expect(isStorageAvailable(broken)).toBe(false);
    expect(loadTrips(broken)).toEqual([]);
    expect(saveTrip(trip, broken).ok).toBe(false);
  });
});
