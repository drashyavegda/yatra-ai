import { describe, it, expect } from 'vitest';
import { estimateBudget, STYLE_RATES, formatINR } from '../src/utils/budget.js';

const base = { days: 3, travellers: 2, travelStyle: 'balanced', distanceKm: 700, totalBudget: 20000 };

describe('estimateBudget', () => {
  it('sum of categories equals total', () => {
    const b = estimateBudget(base);
    const sum = b.categories.reduce((s, c) => s + c.amount, 0);
    expect(sum).toBe(b.total);
  });
  it('never produces NaN, Infinity or negatives even with bad input', () => {
    const b = estimateBudget({ days: 'abc', travellers: -4, travelStyle: 'luxury', distanceKm: NaN, totalBudget: 'x' });
    for (const c of b.categories) {
      expect(Number.isFinite(c.amount)).toBe(true);
      expect(c.amount).toBeGreaterThanOrEqual(0);
    }
    expect(Number.isFinite(b.total)).toBe(true);
    expect(b.selectedBudget).toBe(0);
    expect(b.style).toBe('balanced');
  });
  it('scales food with travellers and days', () => {
    const one = estimateBudget({ ...base, travellers: 1, days: 1 });
    const four = estimateBudget({ ...base, travellers: 4, days: 2 });
    const food1 = one.categories.find((c) => c.key === 'food').amount;
    const food4 = four.categories.find((c) => c.key === 'food').amount;
    expect(food4).toBe(food1 * 8);
  });
  it('day trip has zero accommodation', () => {
    const b = estimateBudget({ ...base, days: 1 });
    expect(b.nights).toBe(0);
    expect(b.categories.find((c) => c.key === 'accommodation').amount).toBe(0);
  });
  it('reports within budget and remaining correctly', () => {
    const b = estimateBudget({ ...base, totalBudget: 1000000 });
    expect(b.withinBudget).toBe(true);
    expect(b.remaining).toBe(1000000 - b.total);
    expect(b.suggestions).toHaveLength(0);
  });
  it('reports over budget with suggestions', () => {
    const b = estimateBudget({ ...base, travelStyle: 'comfort', totalBudget: 5000, destinationCount: 2 });
    expect(b.withinBudget).toBe(false);
    expect(b.overBy).toBe(b.total - 5000);
    expect(b.suggestions.length).toBeGreaterThan(0);
    const keys = b.suggestions.map((s) => s.key);
    expect(keys).toContain('style');
    expect(keys).toContain('days');
    expect(keys).toContain('destinations');
    for (const s of b.suggestions) expect(Number.isFinite(s.estimatedTotal)).toBe(true);
  });
  it('comfort costs more than budget style', () => {
    const cheap = estimateBudget({ ...base, travelStyle: 'budget' });
    const posh = estimateBudget({ ...base, travelStyle: 'comfort' });
    expect(posh.total).toBeGreaterThan(cheap.total);
  });
  it('falls back to assumed distance when route unknown', () => {
    const b = estimateBudget({ ...base, distanceKm: null });
    expect(b.distanceKnown).toBe(false);
    expect(b.distanceKm).toBe(150 * 3);
  });
  it('formats INR', () => {
    expect(formatINR(123456)).toBe('₹1,23,456');
    expect(formatINR('bad')).toBe('₹0');
  });
  it('has rates for every style', () => {
    expect(Object.keys(STYLE_RATES)).toEqual(['budget', 'balanced', 'comfort']);
  });
});
