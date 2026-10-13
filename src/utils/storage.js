// Safe localStorage wrapper for saved trips. Never throws; returns sensible
// defaults when storage is unavailable or data is corrupted.

export const STORAGE_KEY = 'yatraai.savedTrips.v1';
export const MAX_SAVED_TRIPS = 20;

function getStore(storage) {
  if (storage) return storage;
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  } catch {
    /* access can throw in private modes */
  }
  return null;
}

export function isStorageAvailable(storage) {
  const s = getStore(storage);
  if (!s) return false;
  try {
    const k = '__yatraai_test__';
    s.setItem(k, '1');
    s.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

function isTripLike(t) {
  return t && typeof t === 'object' && typeof t.id === 'string' && Array.isArray(t.days) && t.days.length > 0 && t.budget && typeof t.budget === 'object';
}

export function loadTrips(storage) {
  const s = getStore(storage);
  if (!s) return [];
  try {
    const raw = s.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTripLike);
  } catch {
    return [];
  }
}

function persist(trips, storage) {
  const s = getStore(storage);
  if (!s) return { ok: false, error: 'Saved trips are unavailable because browser storage is not accessible.' };
  try {
    s.setItem(STORAGE_KEY, JSON.stringify(trips));
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not save: browser storage is full or blocked.' };
  }
}

export function saveTrip(trip, storage) {
  if (!isTripLike(trip)) return { ok: false, error: 'This trip cannot be saved because it is incomplete.', trips: loadTrips(storage) };
  const existing = loadTrips(storage).filter((t) => t.id !== trip.id);
  const trips = [{ ...trip, savedAt: new Date().toISOString() }, ...existing].slice(0, MAX_SAVED_TRIPS);
  const res = persist(trips, storage);
  return { ...res, trips: res.ok ? trips : existing };
}

export function deleteTrip(id, storage) {
  const trips = loadTrips(storage).filter((t) => t.id !== id);
  const res = persist(trips, storage);
  return { ...res, trips };
}

export function clearTrips(storage) {
  const s = getStore(storage);
  if (!s) return { ok: false, error: 'Browser storage is not accessible.', trips: [] };
  try {
    s.removeItem(STORAGE_KEY);
    return { ok: true, trips: [] };
  } catch {
    return { ok: false, error: 'Could not clear saved trips.', trips: loadTrips(storage) };
  }
}
