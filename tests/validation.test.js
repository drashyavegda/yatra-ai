import { describe, it, expect } from 'vitest';
import { validateTripForm } from '../src/utils/validation.js';

const good = { startingCity: 'Mysuru', days: '3', budget: '8000', travellers: '2', interests: ['Nature'], travelStyle: 'budget', preferences: '' };

describe('validateTripForm', () => {
  it('accepts valid input and normalises types', () => {
    const r = validateTripForm(good);
    expect(r.isValid).toBe(true);
    expect(r.values).toMatchObject({ startingCity: 'Mysuru', days: 3, budget: 8000, travellers: 2 });
  });
  it('rejects negative, zero and non-numeric budgets', () => {
    expect(validateTripForm({ ...good, budget: '-100' }).errors.budget).toBeTruthy();
    expect(validateTripForm({ ...good, budget: '0' }).errors.budget).toBeTruthy();
    expect(validateTripForm({ ...good, budget: 'abc' }).errors.budget).toBeTruthy();
    expect(validateTripForm({ ...good, budget: '' }).errors.budget).toBeTruthy();
  });
  it('rejects invalid durations', () => {
    expect(validateTripForm({ ...good, days: '0' }).errors.days).toBeTruthy();
    expect(validateTripForm({ ...good, days: '15' }).errors.days).toBeTruthy();
    expect(validateTripForm({ ...good, days: '' }).errors.days).toBeTruthy();
    expect(validateTripForm({ ...good, days: '14' }).isValid).toBe(true);
  });
  it('requires city, interests and style', () => {
    expect(validateTripForm({ ...good, startingCity: '  ' }).errors.startingCity).toBeTruthy();
    expect(validateTripForm({ ...good, interests: [] }).errors.interests).toBeTruthy();
    expect(validateTripForm({ ...good, travelStyle: 'luxury' }).errors.travelStyle).toBeTruthy();
  });
  it('limits preferences length', () => {
    expect(validateTripForm({ ...good, preferences: 'x'.repeat(301) }).errors.preferences).toBeTruthy();
  });
});
