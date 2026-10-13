// Vercel serverless function: optional real-AI itinerary generation.
// - GET  -> { configured: boolean } so the UI can show the right mode
// - POST -> { ok, itinerary, model } or { ok:false, code, error }
// The API key lives only in server environment variables (AI_API_KEY).
// Works with any OpenAI-compatible chat-completions endpoint.

import { DESTINATIONS, INTERESTS } from '../src/data/destinations.js';

const ALLOWED_STYLES = ['budget', 'balanced', 'comfort'];
const UPSTREAM_TIMEOUT_MS = 25000;

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : {};
}

export function validateRequest(body) {
  const errors = [];
  const startingCity = typeof body.startingCity === 'string' ? body.startingCity.trim().slice(0, 60) : '';
  if (!startingCity) errors.push('startingCity is required');
  const days = Number(body.days);
  if (!Number.isInteger(days) || days < 1 || days > 14) errors.push('days must be an integer from 1 to 14');
  const travellers = Number(body.travellers);
  if (!Number.isInteger(travellers) || travellers < 1 || travellers > 20) errors.push('travellers must be 1-20');
  const budget = Number(body.budget);
  if (!Number.isFinite(budget) || budget <= 0 || budget > 10000000) errors.push('budget must be a positive number');
  const interests = Array.isArray(body.interests) ? body.interests.filter((i) => INTERESTS.includes(i)).slice(0, 9) : [];
  if (!interests.length) errors.push('at least one valid interest is required');
  const travelStyle = ALLOWED_STYLES.includes(body.travelStyle) ? body.travelStyle : null;
  if (!travelStyle) errors.push('travelStyle must be budget, balanced or comfort');
  const preferences = typeof body.preferences === 'string' ? body.preferences.trim().slice(0, 300) : '';
  return { errors, values: { startingCity, days, travellers, budget: Math.round(budget), interests, travelStyle, preferences } };
}

function candidateDestinations(interests) {
  return DESTINATIONS.map((d) => ({
    name: d.name,
    district: d.district,
    category: d.category,
    interests: d.interests,
    activities: d.activities.map((a) => a.title),
    match: d.interests.filter((i) => interests.includes(i)).length,
  }))
    .sort((a, b) => b.match - a.match)
    .slice(0, 12)
    .map(({ match, ...rest }) => rest);
}

function buildMessages(values) {
  const system = [
    'You are a careful travel planner for the Indian state of Karnataka.',
    'Plan ONLY with destinations from the provided candidate list. Do not invent places.',
    'Do not state prices, ticket costs, opening hours, or transport timetables; those must be verified by the traveller.',
    'Keep geographically sensible sequences: group nearby destinations and avoid long back-and-forth travel.',
    'Respond with strict JSON only, matching this schema:',
    '{"summary": string, "days": [{"day": number, "title": string, "destinationName": string (exact name from the list), "travel": [string], "activities": [{"title": string, "detail": string}], "reason": string}], "tips": [string]}',
    'The "days" array must contain exactly the requested number of days.',
  ].join(' ');
  const user = JSON.stringify({
    request: values,
    candidateDestinations: candidateDestinations(values.interests),
  });
  return [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];
}

export function validateItineraryShape(obj, days) {
  if (!obj || typeof obj !== 'object' || !Array.isArray(obj.days)) return 'missing days array';
  if (obj.days.length !== days) return `expected ${days} days, got ${obj.days.length}`;
  for (const d of obj.days) {
    if (!d || typeof d !== 'object') return 'invalid day entry';
    if (!Array.isArray(d.activities) || d.activities.length === 0) return 'a day has no activities';
  }
  return null;
}

function extractJson(text) {
  if (typeof text !== 'string') return null;
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end <= start) return null;
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

export default async function handler(req, res) {
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || 'gpt-4o-mini';
  const apiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';

  if (req.method === 'GET') {
    return send(res, 200, { configured: Boolean(apiKey), model: apiKey ? model : null });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return send(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED', error: 'Use POST.' });
  }
  if (!apiKey) {
    return send(res, 503, { ok: false, code: 'NO_API_KEY', error: 'AI is not configured on this deployment. The app runs in demo mode.' });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return send(res, 400, { ok: false, code: 'BAD_JSON', error: 'Request body must be valid JSON.' });
  }
  const { errors, values } = validateRequest(body || {});
  if (errors.length) return send(res, 400, { ok: false, code: 'INVALID_INPUT', error: errors.join('; ') });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  let upstream;
  try {
    upstream = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        response_format: { type: 'json_object' },
        messages: buildMessages(values),
      }),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    const timedOut = err?.name === 'AbortError';
    return send(res, timedOut ? 504 : 502, { ok: false, code: timedOut ? 'TIMEOUT' : 'UPSTREAM_UNREACHABLE', error: timedOut ? 'The AI provider took too long to respond.' : 'Could not reach the AI provider.' });
  }
  clearTimeout(timer);

  if (!upstream.ok) {
    // Do not leak provider error bodies (they can include request details); log server-side only.
    console.error('AI provider error', upstream.status);
    return send(res, 502, { ok: false, code: 'UPSTREAM_ERROR', error: `The AI provider returned an error (HTTP ${upstream.status}).` });
  }
  let data;
  try {
    data = await upstream.json();
  } catch {
    return send(res, 502, { ok: false, code: 'UPSTREAM_MALFORMED', error: 'The AI provider returned an unreadable response.' });
  }
  const content = data?.choices?.[0]?.message?.content;
  const itinerary = extractJson(content);
  const shapeError = validateItineraryShape(itinerary, values.days);
  if (shapeError) {
    return send(res, 502, { ok: false, code: 'AI_MALFORMED', error: `The AI response could not be used (${shapeError}). Please retry.` });
  }
  return send(res, 200, { ok: true, model, itinerary });
}
