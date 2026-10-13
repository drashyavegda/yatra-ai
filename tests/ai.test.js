import { describe, it, expect } from 'vitest';
import { validateAiItinerary, AiError } from '../src/services/aiService.js';
import { validateRequest, validateItineraryShape } from '../api/generate-trip.js';

const input = { startingCity: 'Bengaluru', days: 2, budget: 8000, travellers: 2, interests: ['Heritage'], travelStyle: 'budget', preferences: '' };

describe('AI response validation (client)', () => {
  it('rejects malformed responses', () => {
    expect(() => validateAiItinerary(null, input)).toThrow(AiError);
    expect(() => validateAiItinerary({ days: [] }, input)).toThrow(/instead of 2/);
    expect(() => validateAiItinerary({ days: [{ activities: [] }, { activities: ['x'] }] }, input)).toThrow(/no activities/);
  });
  it('accepts a good response, strips HTML and maps destinations', () => {
    const raw = { summary: 'ok', days: [
      { title: 'Hampi day', destinationName: 'Hampi', activities: ['<b>Vittala</b> temple', { title: 'Sunset', detail: 'Matanga hill' }], reason: 'heritage' },
      { title: 'Unknown', destinationName: 'Nowhere Town', activities: ['walk'] },
    ] };
    const v = validateAiItinerary(raw, input);
    expect(v.days[0].destinationId).toBe('hampi');
    expect(v.days[0].activities[0].title).toBe('Vittala temple');
    expect(v.days[1].unmatched).toBe(true);
  });
});

describe('server request validation', () => {
  it('rejects bad input', () => {
    expect(validateRequest({}).errors.length).toBeGreaterThan(0);
    expect(validateRequest({ ...input, days: 20 }).errors.join()).toMatch(/days/);
    expect(validateRequest({ ...input, budget: -5 }).errors.join()).toMatch(/budget/);
    expect(validateRequest({ ...input, interests: ['Skiing'] }).errors.join()).toMatch(/interest/);
  });
  it('accepts good input and trims long preferences', () => {
    const r = validateRequest({ ...input, preferences: 'y'.repeat(1000) });
    expect(r.errors).toEqual([]);
    expect(r.values.preferences).toHaveLength(300);
  });
  it('validates itinerary shape', () => {
    expect(validateItineraryShape({ days: [{ activities: ['a'] }] }, 1)).toBeNull();
    expect(validateItineraryShape({ days: [{ activities: [] }] }, 1)).toMatch(/no activities/);
    expect(validateItineraryShape({}, 1)).toMatch(/missing/);
  });
});
