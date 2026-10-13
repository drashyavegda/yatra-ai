import { describe, it, expect } from 'vitest';
import { filterDestinations } from '../src/pages/Explore.jsx';
import { filterPhrases } from '../src/pages/KannadaGuide.jsx';
import { DESTINATIONS } from '../src/data/destinations.js';
import { PHRASES } from '../src/data/phrases.js';
import { findCity } from '../src/data/cities.js';

describe('dataset integrity', () => {
  it('has at least 12 destinations with unique ids and required fields', () => {
    expect(DESTINATIONS.length).toBeGreaterThanOrEqual(12);
    const ids = new Set(DESTINATIONS.map((d) => d.id));
    expect(ids.size).toBe(DESTINATIONS.length);
    for (const d of DESTINATIONS) {
      expect(d.activities.length).toBeGreaterThanOrEqual(3);
      expect(d.interests.length).toBeGreaterThan(0);
      expect(Number.isFinite(d.lat) && Number.isFinite(d.lon)).toBe(true);
      expect(d.verification).toBeTruthy();
    }
  });
  it('has at least 15 phrases with Kannada script', () => {
    expect(PHRASES.length).toBeGreaterThanOrEqual(15);
    for (const p of PHRASES) expect(/[\u0C80-\u0CFF]/.test(p.kannada)).toBe(true);
  });
});

describe('explore filters', () => {
  it('search by name', () => {
    expect(filterDestinations(DESTINATIONS, { query: 'hampi' }).map((d) => d.id)).toEqual(['hampi']);
  });
  it('filter by category and interest', () => {
    const r = filterDestinations(DESTINATIONS, { category: 'Heritage', interest: 'Architecture' });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((d) => d.category === 'Heritage' && d.interests.includes('Architecture'))).toBe(true);
  });
  it('returns empty for nonsense', () => {
    expect(filterDestinations(DESTINATIONS, { query: 'zzzz' })).toEqual([]);
  });
});

describe('phrase filters', () => {
  it('search in english, pronunciation and kannada', () => {
    expect(filterPhrases(PHRASES, { query: 'thank' })[0].pronunciation).toBe('Dhanyavadagalu');
    expect(filterPhrases(PHRASES, { query: 'namask' }).length).toBe(1);
    expect(filterPhrases(PHRASES, { query: 'ನೀರು' }).length).toBe(1);
  });
  it('filters by category', () => {
    expect(filterPhrases(PHRASES, { category: 'Food' }).every((p) => p.category === 'Food')).toBe(true);
  });
});

describe('findCity', () => {
  it('resolves names and aliases, returns null for unknown', () => {
    expect(findCity('Bangalore').name).toBe('Bengaluru');
    expect(findCity('  mysore ').name).toBe('Mysuru');
    expect(findCity('Goa').name).toBe('Panaji (Goa)');
    expect(findCity('Atlantis')).toBeNull();
  });
});
