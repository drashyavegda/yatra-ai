# YatraAI Karnataka

**Discover Karnataka. Your Journey, Your Way.**

A student prototype for the **Kannada Digital Innovation Hackathon 2026** — problem statement *AI Travel Planner for Karnataka*.

YatraAI Karnataka helps travellers plan personalised trips across Karnataka from their starting city, number of days, budget (₹), group size, interests and travel style. It produces a day-by-day itinerary, a transparent budget estimate, destination recommendations with cultural context, and useful Kannada phrases.

> **Status:** working prototype. It runs fully in **demo mode without any API key**. Real AI generation is an optional add-on through a serverless function. Nothing in this project has been deployed publicly yet.

---

## 1. What it does

| Page | What works |
|---|---|
| **Home** | Landing page with hero, featured destinations, how it works, budget intro, Kannada preview, responsible-travel section and calls to action. All buttons navigate. |
| **Plan My Trip** | Validated trip form → itinerary with day cards, travel legs, reasons for each pick, budget breakdown, destinations and Kannada phrases. Edit & regenerate, save, print. |
| **Explore Karnataka** | 16 curated destinations; search by name/district/region, filter by category and interest, clear filters, detail modal with context, practical notes, accessibility status and an external map-search link. |
| **Kannada Guide** | 30 phrases in Kannada script with English meaning, Roman pronunciation and category; search + category filters. |
| **Saved Trips** | Save / open / delete / clear-all (with confirmation) using `localStorage`; survives corrupted or unavailable storage. |

## 2. Features

- **Deterministic demo itinerary generator (mandatory fallback, no AI).** Scores the curated dataset against your interests, considers your starting city (29 reference cities incl. aliases such as *Bangalore*, *Mysore*, *Goa*), clusters nearby places, orders them nearest-neighbour from your start, and allocates days so multi-day trips never end with an "arrive and immediately return" day. Shows approximate road distances and a clear demo notice.
- **Budget calculator** with transportation, accommodation, food, activities and 10 % contingency; scales with travellers, nights and estimated distance; shows remaining / over-budget and concrete alternatives (cheaper style, shorter trip, fewer destinations, lower-cost activities) with recomputed totals. Category amounts always sum to the displayed total.
- **Optional real AI mode** via `api/generate-trip.js` (Vercel serverless, OpenAI-compatible chat-completions API). Server-side validation, 25 s timeout, strict JSON-shape validation on the server **and** the client, HTML stripped from AI text, destinations cross-checked against the dataset. AI output is always labelled *AI-generated*; demo output is always labelled *Demo generator (no AI)*. If AI fails you get an error with **Retry** and **Use demo mode instead** — never silently substituted output.
- **Honest data policy.** No invented prices, opening hours or timetables. Accessibility shows *"Information not verified"* unless verified. Each destination lists a verification status.
- **Responsive design** (tested at 360, 390, 768, 1024, 1366 px) with mobile navigation, accessible labels, keyboard-closable modal, reduced-motion support, image fallbacks and print styles.
- **Genuine photographs** from Wikimedia Commons (CC BY / CC BY-SA / CC0), stored locally in `public/images` with attribution in the footer and `src/data/imageCredits.js`.

## 3. Technology stack

- React 18 + Vite 5 (JavaScript, standard CSS, no UI framework)
- `lucide-react` icons
- Vitest (unit tests), Playwright (optional browser smoke tests)
- Vercel serverless function for the optional AI endpoint
- `localStorage` for saved trips — no database, no accounts

## 4. Install

```bash
npm install
```

Requires Node 18+ (developed on Node 20).

## 5. Run locally

```bash
npm run dev        # http://localhost:5173  (demo mode unless AI env vars are set)
npm run build      # production build to dist/
npm run preview    # serve the production build (static only — no /api)
npm test           # unit tests (vitest)
```

The Vite dev server mounts `api/generate-trip.js` at `/api/generate-trip` through a small plugin in `vite.config.js`, so AI mode can be tried locally by exporting the environment variables before `npm run dev`. (`vercel dev` also works.)

## 6. How demo mode works

If `AI_API_KEY` is not set, `GET /api/generate-trip` reports `configured:false` (or is unreachable), and the planner uses `src/utils/itineraryGenerator.js`:

1. Validate inputs (`src/utils/validation.js`).
2. Score each destination: +2 per matching interest, a small bonus for proximity to the start city, a heavy penalty beyond a sensible radius for the trip length (230 km for 1 day, 450 km up to 3 days, …), and a penalty for the start city itself.
3. Choose 1–6 "bases" (depends on days), greedily preferring relevant places close to the previous base; then order them nearest-neighbour from the start.
4. Allocate days (extra days go to later bases), lay out activities ordered by interest match, add travel legs with approximate road distances (haversine × 1.3, rounded to 5 km), and use nearby day-excursions rather than generic filler when a base runs out of activities.
5. Estimate the budget (`src/utils/budget.js`) and attach a small phrase set.

Every demo result displays:

> *Demo itinerary: generated from our sample Karnataka destination dataset. Route details, availability, and costs should be verified before travel.*

## 7. Optional AI configuration

Copy `.env.example` to `.env` (never commit it) or set the variables in Vercel → Project → Settings → Environment Variables:

| Variable | Required | Notes |
|---|---|---|
| `AI_API_KEY` | for AI mode | Secret. **Do not** prefix with `VITE_` — that would expose it in the browser bundle. |
| `AI_API_URL` | optional | Any OpenAI-compatible chat-completions URL. Default `https://api.openai.com/v1/chat/completions`. |
| `AI_MODEL` | optional | Default `gpt-4o-mini`. |

The function sends only the trip request (city, days, budget, travellers, interests, style, free-text preferences) plus a short list of candidate destinations from the dataset — no personal identifiers. The budget shown in AI mode is still computed by the local estimator, and the UI says so.

## 8. Deploy on Vercel

1. Push this folder to a Git repository (GitHub/GitLab/Bitbucket).
2. In Vercel: **Add New → Project → Import** the repo. Framework preset **Vite** is detected automatically (build `npm run build`, output `dist`).
3. (Optional) Add `AI_API_KEY`, `AI_API_URL`, `AI_MODEL` under Environment Variables for Production/Preview.
4. Deploy. The `api/` folder becomes a serverless function at `/api/generate-trip`; `vercel.json` raises its max duration to 30 s.
5. Verify: open `/#/plan` — the engine pill shows *Demo mode* (no key) or *AI mode (model)*.

Navigation uses hash routes (`/#/plan`, `/#/explore` …), so no rewrite rules are needed and deep links work on static hosting.

Alternatively, from the CLI: `npm i -g vercel && vercel` (then `vercel --prod`).

## 9. Testing

Executed during development (see the summary in the project hand-over):

- `npm test` — 45 Vitest unit tests covering the budget calculator, generator, validation, storage, AI response validation, server request validation, dataset integrity and page filters.
- `npm run test:e2e` — Playwright smoke test against a running server (`BASE` env var, default `http://localhost:5173`): navigation, validation errors, generation (1-day and 3-day), save/open/delete, corrupted storage, explore and phrase filters, modal, map link, mobile menu, horizontal-overflow checks at 360/390/768/1024 px, image fallback and console errors.
- `npm run test:e2e:ai` — AI-mode flows against a mock OpenAI-compatible server (`node e2e/mock-ai-server.cjs`, then start Vite with `AI_API_KEY=test AI_API_URL=http://localhost:9999/v1/chat/completions`): success, upstream failure, malformed output, retry, explicit demo fallback, and a check that the key never appears in client source.

Playwright needs `npx playwright install chromium` (and system libraries on Linux).

## 10. Current limitations

- Distances are straight-line estimates × 1.3, not routed; travel times are intentionally **not** shown.
- The dataset is a curated sample of 16 destinations; Karnataka has far more. Practical details (timings, fees, facilities) are deliberately omitted because they change and were not verified.
- Accessibility information is marked *not verified* for all destinations.
- The demo generator does not interpret free-text preferences (it says so in the result); AI mode passes them to the model.
- No map rendering or live transport data — only an external map-search link.
- Saved trips live only in the current browser.
- AI mode has been tested against a mock provider; it follows the OpenAI chat-completions format but has not been run against a paid provider in this environment.
- Not yet deployed; no public URL exists.

## Photo credits

All destination photographs are from Wikimedia Commons under free licences; see `src/data/imageCredits.js` and the site footer for author and licence of each image.
