import { describe, it, expect } from 'vitest';
import { generateDemoItinerary, selectBases, baseCountForDays, DEMO_NOTICE } from '../src/utils/itineraryGenerator.js';
import { DESTINATIONS } from '../src/data/destinations.js';

const input = { startingCity: 'Bengaluru', days: 3, budget: 8000, travellers: 2, interests: ['Nature', 'Heritage'], travelStyle: 'budget', preferences: '' };

describe('generateDemoItinerary', () => {
  it('produces the requested number of days', () => {
    for (const days of [1, 2, 3, 5, 7, 14]) {
      const t = generateDemoItinerary({ ...input, days });
      expect(t.days).toHaveLength(days);
      expect(t.days.map((d) => d.day)).toEqual(Array.from({ length: days }, (_, i) => i + 1));
    }
  });
  it('is labelled as demo, never AI', () => {
    const t = generateDemoItinerary(input);
    expect(t.mode).toBe('demo');
    expect(t.notices[0]).toBe(DEMO_NOTICE);
    expect(t.modeLabel.toLowerCase()).not.toMatch(/\bai[- ]generated\b/);
  });
  it('every day has activities and a reason', () => {
    const t = generateDemoItinerary({ ...input, days: 6, interests: ['Beaches', 'Food'] });
    for (const d of t.days) {
      expect(d.activities.length).toBeGreaterThan(0);
      expect(d.reason).toBeTruthy();
      expect(DESTINATIONS.some((x) => x.id === d.destinationId)).toBe(true);
    }
  });
  it('selected bases match at least one chosen interest', () => {
    for (const interests of [['Beaches'], ['Wildlife'], ['Architecture', 'Spiritual tourism'], ['Adventure']]) {
      const t = generateDemoItinerary({ ...input, days: 4, interests });
      for (const b of t.bases) {
        const dest = DESTINATIONS.find((d) => d.id === b.id);
        expect(dest.interests.some((i) => interests.includes(i))).toBe(true);
      }
    }
  });
  it('one-day trip from Bengaluru stays reasonably close', () => {
    const t = generateDemoItinerary({ ...input, days: 1, interests: ['Heritage'] });
    expect(t.bases).toHaveLength(1);
    expect(t.bases[0].distanceFromStartKm).toBeLessThanOrEqual(230);
    expect(t.bases[0].id).not.toBe('bengaluru');
  });
  it('first and last day include travel legs from/to the start', () => {
    const t = generateDemoItinerary(input);
    expect(t.days[0].travel[0]).toMatch(/Travel from Bengaluru/);
    expect(t.days[t.days.length - 1].travel.some((s) => /Return journey/.test(s))).toBe(true);
  });
  it('handles an unknown starting city gracefully', () => {
    const t = generateDemoItinerary({ ...input, startingCity: 'Atlantis' });
    expect(t.startKnown).toBe(false);
    expect(t.distanceKm).toBeNull();
    expect(t.notices.some((n) => n.includes('Atlantis'))).toBe(true);
    expect(t.budget.total).toBeGreaterThan(0);
  });
  it('accepts city aliases', () => {
    const t = generateDemoItinerary({ ...input, startingCity: 'bangalore' });
    expect(t.startCity).toBe('Bengaluru');
  });
  it('clusters bases: consecutive hops are not absurdly long for short trips', () => {
    const { bases } = selectBases({ ...input, days: 4, interests: ['Heritage', 'Architecture'] });
    expect(bases.length).toBe(2);
  });
  it('baseCountForDays caps at 6', () => {
    expect(baseCountForDays(1)).toBe(1);
    expect(baseCountForDays(3)).toBe(2);
    expect(baseCountForDays(14)).toBe(6);
    expect(baseCountForDays(14, 3)).toBe(3);
  });
  it('multi-day trips never end with an arrive-and-return day', () => {
    for (const days of [3, 5, 7, 14]) {
      const t = generateDemoItinerary({ ...input, days, interests: ['Nature', 'Heritage', 'Beaches'] });
      const last = t.days[t.days.length - 1];
      expect(last.travel.some((s) => /Travel from/.test(s))).toBe(false);
    }
  });
  it('budget is attached and consistent', () => {
    const t = generateDemoItinerary(input);
    expect(t.budget.selectedBudget).toBe(8000);
    expect(t.budget.categories.reduce((s, c) => s + c.amount, 0)).toBe(t.budget.total);
    expect(t.phrases.length).toBeGreaterThanOrEqual(5);
  });
});
