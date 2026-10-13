// Budget estimator. All figures are planning ASSUMPTIONS (rupees), not live
// prices. They are deliberately simple so that judges and users can see and
// challenge them. Every function here is pure so it can be unit-tested.

export const CONTINGENCY_RATE = 0.1;
export const FALLBACK_KM_PER_DAY = 150; // used when the route distance is unknown

export const STYLE_RATES = {
  budget: {
    label: 'Budget',
    roomPerNight: 900, // basic lodge / hostel room shared by two
    foodPerPersonPerDay: 350,
    activitiesPerPersonPerDay: 150,
    localTransportPerPersonPerDay: 100,
    intercityPerPersonPerKm: 1.5, // state buses / sleeper trains
    transportLabel: 'State buses and trains',
    stayLabel: 'Basic lodges or hostels (2 per room)',
  },
  balanced: {
    label: 'Balanced',
    roomPerNight: 2000,
    foodPerPersonPerDay: 600,
    activitiesPerPersonPerDay: 300,
    localTransportPerPersonPerDay: 200,
    intercityPerPersonPerKm: 3,
    transportLabel: 'Mix of trains, AC buses and shared cabs',
    stayLabel: 'Mid-range hotels or homestays (2 per room)',
  },
  comfort: {
    label: 'Comfort',
    roomPerNight: 4000,
    foodPerPersonPerDay: 1000,
    activitiesPerPersonPerDay: 600,
    localTransportPerPersonPerDay: 400,
    intercityPerPersonPerKm: 6,
    transportLabel: 'Private cab for most legs',
    stayLabel: 'Comfortable hotels or resorts (2 per room)',
  },
};

function safeInt(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

export function roundTo10(n) {
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n / 10) * 10;
}

/**
 * Estimates a trip budget.
 * @param {object} p
 * @param {number} p.days 1..14
 * @param {number} p.travellers >= 1
 * @param {'budget'|'balanced'|'comfort'} p.travelStyle
 * @param {number|null} p.distanceKm total round-trip distance; null if unknown
 * @param {number} p.totalBudget the user's budget in INR
 * @param {number} [p.destinationCount]
 */
export function estimateBudget({ days, travellers, travelStyle, distanceKm, totalBudget, destinationCount = 1 }) {
  const d = safeInt(days, 1, 14, 1);
  const people = safeInt(travellers, 1, 20, 1);
  const style = STYLE_RATES[travelStyle] ? travelStyle : 'balanced';
  const r = STYLE_RATES[style];
  const budgetIn = Number(totalBudget);
  const selectedBudget = Number.isFinite(budgetIn) && budgetIn > 0 ? Math.round(budgetIn) : 0;

  const distanceKnown = Number.isFinite(distanceKm) && distanceKm >= 0;
  const km = distanceKnown ? distanceKm : FALLBACK_KM_PER_DAY * d;

  const nights = Math.max(d - 1, 0);
  const rooms = Math.ceil(people / 2);

  const transportation = roundTo10(people * km * r.intercityPerPersonPerKm + people * d * r.localTransportPerPersonPerDay);
  const accommodation = roundTo10(rooms * nights * r.roomPerNight);
  const food = roundTo10(people * d * r.foodPerPersonPerDay);
  const activities = roundTo10(people * d * r.activitiesPerPersonPerDay);
  const subtotal = transportation + accommodation + food + activities;
  const contingency = roundTo10(subtotal * CONTINGENCY_RATE);

  const categories = [
    { key: 'transportation', label: 'Transportation', amount: transportation, note: `${r.transportLabel}; about ${Math.round(km)} km round trip${distanceKnown ? '' : ' (assumed, route unknown)'} plus local travel.` },
    { key: 'accommodation', label: 'Accommodation', amount: accommodation, note: nights === 0 ? 'Day trip: no overnight stay assumed.' : `${nights} night${nights > 1 ? 's' : ''}, ${rooms} room${rooms > 1 ? 's' : ''} at about ₹${r.roomPerNight.toLocaleString('en-IN')} per night. ${r.stayLabel}.` },
    { key: 'food', label: 'Food', amount: food, note: `About ₹${r.foodPerPersonPerDay} per person per day.` },
    { key: 'activities', label: 'Activities & entry fees', amount: activities, note: `About ₹${r.activitiesPerPersonPerDay} per person per day for entries, guides and local experiences.` },
    { key: 'contingency', label: 'Contingency', amount: contingency, note: `${Math.round(CONTINGENCY_RATE * 100)}% buffer for price changes and surprises.` },
  ];

  const total = categories.reduce((sum, c) => sum + c.amount, 0);
  const remaining = selectedBudget - total;
  const withinBudget = remaining >= 0;
  const perPerson = Math.round(total / people);

  const result = {
    style,
    styleLabel: r.label,
    days: d,
    travellers: people,
    nights,
    rooms,
    distanceKm: Math.round(km),
    distanceKnown,
    categories: categories.map((c) => ({ ...c, share: total > 0 ? Math.round((c.amount / total) * 100) : 0 })),
    total,
    perPerson,
    selectedBudget,
    remaining,
    overBy: withinBudget ? 0 : -remaining,
    withinBudget,
    suggestions: [],
  };

  if (!withinBudget) {
    result.suggestions = buildSuggestions({ days: d, travellers: people, travelStyle: style, distanceKm: distanceKnown ? km : null, totalBudget: selectedBudget, destinationCount, currentTotal: total });
  }
  return result;
}

function buildSuggestions({ days, travellers, travelStyle, distanceKm, totalBudget, destinationCount, currentTotal }) {
  const tries = [];
  const order = ['budget', 'balanced', 'comfort'];
  const idx = order.indexOf(travelStyle);
  if (idx > 0) {
    const cheaper = order[idx - 1];
    const est = estimateBudget({ days, travellers, travelStyle: cheaper, distanceKm, totalBudget, destinationCount });
    tries.push({ key: 'style', title: `Switch to ${STYLE_RATES[cheaper].label} travel style`, detail: `More economical stay and transport assumptions bring the estimate to about ₹${est.total.toLocaleString('en-IN')}.`, estimatedTotal: est.total, fits: est.withinBudget });
  }
  if (days > 1) {
    const est = estimateBudget({ days: days - 1, travellers, travelStyle, distanceKm, totalBudget, destinationCount });
    tries.push({ key: 'days', title: `Shorten the trip to ${days - 1} day${days - 1 > 1 ? 's' : ''}`, detail: `One fewer night and day of expenses: about ₹${est.total.toLocaleString('en-IN')}.`, estimatedTotal: est.total, fits: est.withinBudget });
  }
  if (destinationCount > 1 && Number.isFinite(distanceKm)) {
    const reducedKm = distanceKm * ((destinationCount - 1) / destinationCount);
    const est = estimateBudget({ days, travellers, travelStyle, distanceKm: reducedKm, totalBudget, destinationCount: destinationCount - 1 });
    tries.push({ key: 'destinations', title: 'Visit fewer destinations', detail: `Dropping one base cuts travel distance; roughly ₹${est.total.toLocaleString('en-IN')} if the route shortens proportionally.`, estimatedTotal: est.total, fits: est.withinBudget });
  }
  // Lower-cost activities: recompute with budget-level activity rate only.
  const r = STYLE_RATES[travelStyle];
  const activityDelta = roundTo10(travellers * days * (r.activitiesPerPersonPerDay - STYLE_RATES.budget.activitiesPerPersonPerDay));
  if (activityDelta > 0) {
    const est = Math.max(0, currentTotal - activityDelta - roundTo10(activityDelta * CONTINGENCY_RATE));
    tries.push({ key: 'activities', title: 'Choose lower-cost activities', detail: `Free viewpoints, walks and markets instead of paid experiences: about ₹${est.toLocaleString('en-IN')}.`, estimatedTotal: est, fits: est <= totalBudget });
  }
  return tries;
}

export function formatINR(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return '₹0';
  return '₹' + Math.round(n).toLocaleString('en-IN');
}
