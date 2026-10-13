// Client-side access to the optional AI endpoint. The API key never reaches
// the browser: the serverless function in /api/generate-trip.js holds it.

import { DESTINATIONS, findDestinationByName } from '../data/destinations.js';
import { findCity } from '../data/cities.js';
import { pickTripPhrases } from '../data/phrases.js';
import { roadKm } from '../utils/geo.js';
import { estimateBudget } from '../utils/budget.js';

const ENDPOINT = '/api/generate-trip';
const CLIENT_TIMEOUT_MS = 40000;

/** Asks the server whether an AI key is configured. Never throws. */
export async function getAiStatus() {
  try {
    const res = await fetch(ENDPOINT, { method: 'GET', headers: { Accept: 'application/json' } });
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !type.includes('application/json')) return { reachable: false, configured: false };
    const data = await res.json();
    return { reachable: true, configured: Boolean(data.configured), model: data.model || null };
  } catch {
    return { reachable: false, configured: false };
  }
}

export class AiError extends Error {
  constructor(message, code = 'AI_ERROR') {
    super(message);
    this.code = code;
  }
}

const MAX_TEXT = 300;
const clean = (v, max = MAX_TEXT) => (typeof v === 'string' ? v.replace(/<[^>]*>/g, '').trim().slice(0, max) : '');

/**
 * Validates the raw itinerary object returned by the AI endpoint and converts
 * it into the same shape the demo generator produces. Throws AiError if the
 * structure is unusable.
 */
export function validateAiItinerary(raw, input) {
  if (!raw || typeof raw !== 'object') throw new AiError('The AI response was not a valid itinerary.', 'MALFORMED');
  if (!Array.isArray(raw.days) || raw.days.length !== input.days) {
    throw new AiError(`The AI returned ${Array.isArray(raw.days) ? raw.days.length : 0} day(s) instead of ${input.days}.`, 'MALFORMED');
  }
  const days = raw.days.map((d, i) => {
    if (!d || typeof d !== 'object') throw new AiError(`Day ${i + 1} is missing.`, 'MALFORMED');
    const acts = Array.isArray(d.activities) ? d.activities : [];
    const activities = acts
      .map((a) => (typeof a === 'string' ? { title: clean(a, 160), detail: '' } : { title: clean(a?.title, 160), detail: clean(a?.detail, 300) }))
      .filter((a) => a.title)
      .slice(0, 6);
    if (!activities.length) throw new AiError(`Day ${i + 1} has no activities.`, 'MALFORMED');
    const destName = clean(d.destinationName, 80) || clean(d.title, 80);
    const match = findDestinationByName(destName);
    return {
      day: i + 1,
      title: clean(d.title, 120) || `Day ${i + 1}`,
      destinationId: match ? match.id : null,
      destinationName: match ? match.name : destName || 'Karnataka',
      district: match ? match.district : 'District not verified',
      travel: Array.isArray(d.travel) ? d.travel.map((t) => clean(t, 200)).filter(Boolean).slice(0, 3) : [],
      activities,
      reason: clean(d.reason, 300),
      unmatched: !match,
    };
  });
  return { days, summary: clean(raw.summary, 500), tips: Array.isArray(raw.tips) ? raw.tips.map((t) => clean(t, 200)).filter(Boolean).slice(0, 5) : [] };
}

function buildTripFromAi(validated, input, model) {
  const start = findCity(input.startingCity);
  const seen = new Set();
  const bases = [];
  for (const d of validated.days) {
    if (d.destinationId && !seen.has(d.destinationId)) {
      seen.add(d.destinationId);
      const dest = DESTINATIONS.find((x) => x.id === d.destinationId);
      bases.push({ id: dest.id, name: dest.name, matches: dest.interests.filter((i) => input.interests.includes(i)), distanceFromStartKm: start ? roadKm(start, dest) : null });
    }
  }
  let distanceKm = null;
  if (start && bases.length) {
    let cursor = start;
    distanceKm = 0;
    for (const b of bases) {
      const dest = DESTINATIONS.find((x) => x.id === b.id);
      distanceKm += roadKm(cursor, dest) ?? 0;
      cursor = dest;
    }
    distanceKm += roadKm(cursor, start) ?? 0;
  }
  const budget = estimateBudget({ days: input.days, travellers: input.travellers, travelStyle: input.travelStyle, distanceKm, totalBudget: input.budget, destinationCount: Math.max(bases.length, 1) });
  const notices = [
    `AI-generated itinerary (model: ${model || 'configured provider'}). AI output can contain mistakes: verify places, routes, timings and availability before travelling.`,
    'The budget below is calculated by our own estimator from stated assumptions, not by the AI.',
  ];
  const unmatched = validated.days.filter((d) => d.unmatched).length;
  if (unmatched) notices.push(`${unmatched} day plan(s) mention places outside our curated dataset; those were not cross-checked.`);
  if (!start) notices.push(`"${input.startingCity}" is not in our reference list of cities, so distances were assumed for the budget.`);

  return {
    id: `trip-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    mode: 'ai',
    modeLabel: `AI (${model || 'configured provider'})`,
    title: `${input.days}-day ${input.interests.slice(0, 2).join(' & ').toLowerCase()} trip from ${start ? start.name : input.startingCity}`,
    summary: validated.summary || `An AI-generated ${input.days}-day plan for ${input.travellers} traveller(s).`,
    input: { ...input },
    startCity: start ? start.name : input.startingCity,
    startKnown: Boolean(start),
    bases,
    days: validated.days,
    distanceKm,
    budget,
    phrases: pickTripPhrases(),
    tips: validated.tips,
    notices,
  };
}

/** Calls the AI endpoint. Throws AiError on any failure; never fakes output. */
export async function generateAiItinerary(input) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        startingCity: input.startingCity,
        days: input.days,
        budget: input.budget,
        travellers: input.travellers,
        interests: input.interests,
        travelStyle: input.travelStyle,
        preferences: input.preferences,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if (err?.name === 'AbortError') throw new AiError('The AI request timed out. Please try again or use demo mode.', 'TIMEOUT');
    throw new AiError('Could not reach the AI service. Check your connection or use demo mode.', 'NETWORK');
  }
  clearTimeout(timer);

  let data;
  try {
    data = await res.json();
  } catch {
    throw new AiError('The AI service returned an unreadable response.', 'MALFORMED');
  }
  if (!res.ok || !data?.ok) {
    throw new AiError(data?.error || `AI service error (HTTP ${res.status}).`, data?.code || 'AI_ERROR');
  }
  const validated = validateAiItinerary(data.itinerary, input);
  return buildTripFromAi(validated, input, data.model);
}
