import { INTERESTS } from '../data/destinations.js';

export const TRAVEL_STYLES = ['budget', 'balanced', 'comfort'];
export const MIN_DAYS = 1;
export const MAX_DAYS = 14;
export const MAX_TRAVELLERS = 20;
export const MAX_BUDGET = 10000000; // 1 crore INR upper sanity bound
export const MAX_PREFERENCES_LENGTH = 300;

function toInt(value) {
  if (value === '' || value === null || value === undefined) return NaN;
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : NaN;
}

/**
 * Validates raw form values and returns { errors, values } where values
 * contains normalised, typed data safe for the generator.
 */
export function validateTripForm(raw) {
  const errors = {};
  const startingCity = String(raw.startingCity ?? '').trim();
  if (!startingCity) errors.startingCity = 'Please enter your starting city.';
  else if (startingCity.length > 60) errors.startingCity = 'City name is too long (maximum 60 characters).';
  else if (!/^[\p{L}\p{M} .'()-]+$/u.test(startingCity)) errors.startingCity = 'Please use letters only in the city name.';

  const days = toInt(raw.days);
  if (!Number.isFinite(days)) errors.days = 'Please enter the number of travel days.';
  else if (days < MIN_DAYS || days > MAX_DAYS) errors.days = `Trip duration must be between ${MIN_DAYS} and ${MAX_DAYS} days.`;

  const budgetNum = Number(raw.budget);
  if (raw.budget === '' || raw.budget === null || raw.budget === undefined) errors.budget = 'Please enter your total budget in rupees.';
  else if (!Number.isFinite(budgetNum)) errors.budget = 'Budget must be a number.';
  else if (budgetNum <= 0) errors.budget = 'Budget must be a positive amount.';
  else if (budgetNum > MAX_BUDGET) errors.budget = 'That budget is larger than we can sensibly estimate for. Please enter a smaller amount.';
  const budget = Number.isFinite(budgetNum) ? Math.round(budgetNum) : NaN;

  const travellers = toInt(raw.travellers);
  if (!Number.isFinite(travellers)) errors.travellers = 'Please select the number of travellers.';
  else if (travellers < 1 || travellers > MAX_TRAVELLERS) errors.travellers = `Travellers must be between 1 and ${MAX_TRAVELLERS}.`;

  const interests = Array.isArray(raw.interests) ? raw.interests.filter((i) => INTERESTS.includes(i)) : [];
  if (interests.length === 0) errors.interests = 'Please select at least one interest.';

  const travelStyle = TRAVEL_STYLES.includes(raw.travelStyle) ? raw.travelStyle : null;
  if (!travelStyle) errors.travelStyle = 'Please choose a travel style.';

  const preferences = String(raw.preferences ?? '').trim();
  if (preferences.length > MAX_PREFERENCES_LENGTH) errors.preferences = `Please keep preferences under ${MAX_PREFERENCES_LENGTH} characters.`;

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    values: { startingCity, days, budget, travellers, interests, travelStyle, preferences },
  };
}
