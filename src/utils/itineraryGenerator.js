// Deterministic demo itinerary generator. It does NOT use AI. It scores the
// curated destination dataset against the traveller's interests and starting
// city, clusters nearby places, and lays out day plans.

import { DESTINATIONS } from '../data/destinations.js';
import { findCity } from '../data/cities.js';
import { pickTripPhrases } from '../data/phrases.js';
import { roadKm } from './geo.js';
import { estimateBudget } from './budget.js';

export const DEMO_NOTICE =
  'Demo itinerary: generated from our sample Karnataka destination dataset. Route details, availability, and costs should be verified before travel.';

const ROUTE_NOTICE =
  'Distances are rough road estimates. Exact routes, travel times, timings and availability require verification.';

function reasonableRadiusKm(days) {
  if (days === 1) return 230;
  if (days <= 3) return 450;
  if (days <= 6) return 700;
  return 1200;
}

export function baseCountForDays(days, maxAvailable = DESTINATIONS.length) {
  if (days <= 2) return Math.min(1, maxAvailable);
  return Math.min(Math.ceil(days / 2), 6, maxAvailable);
}

function interestMatches(dest, interests) {
  return dest.interests.filter((i) => interests.includes(i));
}

function scoreDestination(dest, interests, start, days) {
  const matches = interestMatches(dest, interests);
  let score = matches.length * 2;
  // Mild preference for destinations where the first listed (primary) interest matches
  if (matches.length && dest.interests[0] === matches[0]) score += 0.5;
  let distance = null;
  if (start) {
    distance = roadKm(start, dest);
    const radius = reasonableRadiusKm(days);
    if (distance !== null) {
      if (distance > radius) score -= 4 + (distance - radius) / 100;
      else score += 1 - distance / radius; // closer is slightly better
      // Don't send people on a trip to the city they start in unless nothing else matches
      if (distance < 15) score -= 3;
    }
  }
  return { dest, matches, score, distance };
}

/** Greedy selection of bases: best score first, then prefer nearby, relevant places. */
export function selectBases(input, destinations = DESTINATIONS) {
  const { interests, days } = input;
  const start = findCity(input.startingCity);
  const scored = destinations
    .map((d) => scoreDestination(d, interests, start, days))
    .sort((a, b) => b.score - a.score);

  const relevant = scored.filter((s) => s.matches.length > 0);
  const pool = relevant.length ? relevant : scored;
  const count = baseCountForDays(days, pool.length);

  const chosen = [pool[0]];
  while (chosen.length < count) {
    const prev = chosen[chosen.length - 1].dest;
    let best = null;
    let bestVal = -Infinity;
    for (const cand of pool) {
      if (chosen.includes(cand)) continue;
      const hop = roadKm(prev, cand.dest) ?? 300;
      const val = cand.score - hop / 120; // cluster: 240 km hop costs 2 points
      if (val > bestVal) {
        bestVal = val;
        best = cand;
      }
    }
    if (!best) break;
    chosen.push(best);
  }

  // Order by nearest-neighbour from the start city (or keep score order if unknown)
  let ordered = chosen;
  if (start) {
    ordered = [];
    let cursor = start;
    const remaining = [...chosen];
    while (remaining.length) {
      remaining.sort((a, b) => (roadKm(cursor, a.dest) ?? 0) - (roadKm(cursor, b.dest) ?? 0));
      const next = remaining.shift();
      ordered.push(next);
      cursor = next.dest;
    }
  }
  return { bases: ordered, start };
}

// Extra days go to the LATER bases so the trip never ends with an
// "arrive and immediately return" day on a multi-day itinerary.
function allocateDays(days, baseCount) {
  const base = Math.floor(days / baseCount);
  const extra = days % baseCount;
  return Array.from({ length: baseCount }, (_, i) => base + (i >= baseCount - extra ? 1 : 0));
}

function orderedActivities(dest, interests) {
  return [...dest.activities].sort((a, b) => {
    const am = a.interests.filter((i) => interests.includes(i)).length;
    const bm = b.interests.filter((i) => interests.includes(i)).length;
    return bm - am;
  });
}

const FREE_ACTIVITIES = [
  { title: 'Local market and street food walk', detail: 'An unhurried look at everyday life, produce and snacks in town.' },
  { title: 'Sunset viewpoint and evening stroll', detail: 'Ask locally for the best nearby evening spot.' },
  { title: 'Free time', detail: 'Rest, revisit a favourite spot, or follow a local recommendation.' },
  { title: 'Craft and souvenir browsing', detail: 'Look for regional crafts and produce from local sellers.' },
];

/** Nearby dataset destinations (not already a base) usable as day excursions. */
function nearbyExcursions(dest, baseIds, maxKm = 120) {
  return DESTINATIONS.filter((d) => d.id !== dest.id && !baseIds.includes(d.id))
    .map((d) => ({ d, km: roadKm(dest, d) }))
    .filter((x) => x.km !== null && x.km <= maxKm)
    .sort((a, b) => a.km - b.km)
    .map(({ d, km }) => ({ title: `Day excursion to ${d.name} (approx. ${km} km each way)`, detail: `${d.tagline} Verify transport options for the return.` }));
}

function buildDays(bases, allocation, input, start) {
  const { interests, days, startingCity } = input;
  const plans = [];
  let dayNo = 1;
  let prevPoint = start;
  let prevName = start ? start.name : startingCity;
  const baseIds = bases.map((b) => b.dest.id);

  bases.forEach((b, bi) => {
    const dest = b.dest;
    const acts = orderedActivities(dest, interests);
    const extras = [...nearbyExcursions(dest, baseIds), ...FREE_ACTIVITIES];
    const perDay = days === 1 ? 2 : 3;
    let cursor = 0;
    let extraCursor = 0;
    for (let k = 0; k < allocation[bi]; k += 1) {
      const isFirstAtBase = k === 0;
      const isLastDay = dayNo === days;
      const travel = [];
      if (isFirstAtBase) {
        const km = prevPoint ? roadKm(prevPoint, dest) : null;
        travel.push(`Travel from ${prevName} to ${dest.name}${km !== null ? ` (approx. ${km} km by road)` : ''}.`);
      }
      const slots = isFirstAtBase || isLastDay ? Math.max(perDay - 1, 1) : perDay;
      const activities = [];
      for (let s = 0; s < slots; s += 1) {
        if (cursor < acts.length) {
          const a = acts[cursor];
          activities.push({ title: a.title, detail: a.detail });
          cursor += 1;
        } else {
          activities.push(extras[extraCursor % extras.length]);
          extraCursor += 1;
        }
      }
      if (isLastDay) {
        const back = start ? roadKm(dest, start) : null;
        travel.push(`Return journey to ${prevName === dest.name ? startingCity : (start ? start.name : startingCity)}${back !== null ? ` (approx. ${back} km by road)` : ''}.`);
      }
      const matched = b.matches.length ? b.matches : dest.interests.slice(0, 2);
      plans.push({
        day: dayNo,
        title: days === 1 ? `Day trip to ${dest.name}` : isFirstAtBase ? `Arrive in ${dest.name}` : `Explore ${dest.name}`,
        destinationId: dest.id,
        destinationName: dest.name,
        district: dest.district,
        travel,
        activities,
        reason: `${dest.name} matches your interest in ${matched.join(', ').toLowerCase()}${b.distance !== null ? ` and is roughly ${b.distance} km from ${start.name}` : ''}.`,
      });
      dayNo += 1;
    }
    prevPoint = dest;
    prevName = dest.name;
  });
  return plans;
}

function routeDistance(start, bases) {
  if (!start) return null;
  let total = 0;
  let cursor = start;
  for (const b of bases) {
    const km = roadKm(cursor, b.dest);
    if (km === null) return null;
    total += km;
    cursor = b.dest;
  }
  const back = roadKm(cursor, start);
  if (back === null) return null;
  return total + back;
}

function makeId() {
  return `trip-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Generates a complete demo trip from validated input.
 * input: { startingCity, days, budget, travellers, interests, travelStyle, preferences }
 */
export function generateDemoItinerary(input) {
  const { bases, start } = selectBases(input);
  const allocation = allocateDays(input.days, bases.length);
  const days = buildDays(bases, allocation, input, start);
  const distanceKm = routeDistance(start, bases);
  const budget = estimateBudget({
    days: input.days,
    travellers: input.travellers,
    travelStyle: input.travelStyle,
    distanceKm,
    totalBudget: input.budget,
    destinationCount: bases.length,
  });

  const notices = [DEMO_NOTICE, ROUTE_NOTICE];
  if (!start) {
    notices.push(`"${input.startingCity}" is not in our reference list of cities, so distances could not be estimated from it. A typical daily distance was assumed for the budget.`);
  }
  if (input.preferences) {
    notices.push('Your additional preferences are shown for your reference; the demo generator does not interpret free-text preferences.');
  }

  const baseNames = bases.map((b) => b.dest.name);
  return {
    id: makeId(),
    createdAt: new Date().toISOString(),
    mode: 'demo',
    modeLabel: 'Demo generator (no AI)',
    title: `${input.days}-day ${input.interests.slice(0, 2).join(' & ').toLowerCase()} trip from ${start ? start.name : input.startingCity}`,
    summary: `A ${input.days}-day ${budget.styleLabel.toLowerCase()} trip for ${input.travellers} traveller${input.travellers > 1 ? 's' : ''} centred on ${baseNames.join(', ')}, chosen for ${input.interests.join(', ').toLowerCase()}.`,
    input: { ...input },
    startCity: start ? start.name : input.startingCity,
    startKnown: Boolean(start),
    bases: bases.map((b) => ({ id: b.dest.id, name: b.dest.name, matches: b.matches, distanceFromStartKm: b.distance })),
    days,
    distanceKm,
    budget,
    phrases: pickTripPhrases(),
    notices,
  };
}
