// End-to-end smoke test with Playwright against the running dev server.
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = process.env.BASE || 'http://localhost:5173';
const OUT = require('path').join(__dirname, 'screenshots');
fs.mkdirSync(OUT, { recursive: true });

const results = [];
function check(name, ok, extra = '') { results.push({ name, ok, extra }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  -> ' + extra : ''}`); }

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push('PAGEERROR ' + e.message));

  // Home
  await page.goto(BASE + '/#/home', { waitUntil: 'networkidle' });
  check('home renders hero heading', (await page.locator('h1').textContent()).includes('Your Karnataka Journey'));
  await page.screenshot({ path: `${OUT}/01-home-desktop.png`, fullPage: true });
  // hero buttons navigate
  await page.getByRole('button', { name: 'Explore Karnataka' }).first().click();
  await page.waitForTimeout(300);
  check('hero secondary -> explore', page.url().endsWith('#/explore'));
  await page.goto(BASE + '/#/home');
  await page.locator('.hero').getByRole('button', { name: /Plan My Trip/ }).click();
  await page.waitForTimeout(300);
  check('hero primary -> plan', page.url().endsWith('#/plan'));

  // Layout sanity: travel-style cards must be block boxes of sensible width (regression for inline-span bug)
  const boxes = await page.locator('.style-option .box').evaluateAll((els) => els.map((el) => { const r = el.getBoundingClientRect(); return { w: r.width, h: r.height, d: getComputedStyle(el).display }; }));
  check('travel-style cards render as proper blocks', boxes.length === 3 && boxes.every((b) => b.d === 'block' && b.w >= 90 && b.h >= 40 && b.h <= 120), JSON.stringify(boxes));
  // Planner: invalid submission
  await page.getByRole('button', { name: 'Generate My Trip' }).click();
  await page.waitForTimeout(200);
  const errCount = await page.locator('.error-text').count();
  check('empty form shows validation errors', errCount >= 2, `${errCount} errors`);
  await page.fill('#field-startingCity', 'Bengaluru');
  await page.fill('#field-budget', '-500');
  await page.fill('#field-days', '20');
  await page.getByRole('button', { name: 'Generate My Trip' }).click();
  await page.waitForTimeout(200);
  const budgetErr = await page.locator('#err-budget').textContent().catch(() => '');
  const daysErr = await page.locator('#err-days').textContent().catch(() => '');
  check('negative budget rejected', /positive/i.test(budgetErr), budgetErr);
  check('20 days rejected', /between 1 and 14/i.test(daysErr), daysErr);
  check('no itinerary generated on invalid input', (await page.locator('.day-card').count()) === 0);

  // Valid submission
  await page.fill('#field-budget', '8000');
  await page.fill('#field-days', '3');
  await page.selectOption('#field-travellers', '2');
  await page.fill('#field-preferences', 'vegetarian food');
  await page.getByRole('button', { name: 'Generate My Trip' }).click();
  await page.waitForSelector('.day-card', { timeout: 10000 });
  const dayCount = await page.locator('.day-card').count();
  check('3-day trip generates 3 day cards', dayCount === 3, `${dayCount}`);
  const demoNotice = await page.locator('.notice-warn').first().textContent();
  check('demo notice displayed', demoNotice.includes('Demo itinerary: generated from our sample Karnataka destination dataset'));
  const engine = await page.locator('.engine-pill').first().textContent();
  check('engine pill shows demo mode (no key)', /Demo mode/.test(engine), engine.trim());
  const total = await page.locator('.budget-foot span').nth(1).textContent();
  check('budget total rendered without NaN', /₹[\d,]+$/.test(total.trim()) && !/NaN|Infinity/.test(total), total.trim());
  const bodyText = await page.locator('body').innerText();
  check('no NaN/undefined in page text', !/NaN|undefined|Infinity/.test(bodyText));
  await page.screenshot({ path: `${OUT}/02-itinerary-desktop.png`, fullPage: true });

  // Save trip
  await page.getByRole('button', { name: 'Save trip' }).click();
  await page.waitForTimeout(300);
  check('save shows success', (await page.locator('.notice-success').first().textContent()).includes('Trip saved'));
  check('save button becomes Saved/disabled', await page.getByRole('button', { name: 'Saved', exact: true }).isDisabled());
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('yatraai.savedTrips.v1') || '[]').length);
  check('trip persisted to localStorage', stored === 1);

  // Edit & regenerate with different params (1 day, over budget comfort)
  await page.getByRole('button', { name: 'Edit & regenerate' }).click();
  await page.fill('#field-days', '1');
  await page.fill('#field-budget', '500');
  await page.locator('.style-option').nth(2).click();
  await page.getByRole('button', { name: 'Generate My Trip' }).click();
  await page.waitForSelector('.day-card', { timeout: 10000 });
  await page.waitForTimeout(300);
  check('1-day trip generates 1 day card', (await page.locator('.day-card').count()) === 1);
  check('over-budget state shows suggestions', (await page.locator('.suggestion').count()) > 0);
  check('over-budget stat shown', (await page.locator('.stat.over').count()) === 1);

  // Destination modal from itinerary
  await page.getByRole('button', { name: 'Destination details' }).first().click();
  await page.waitForSelector('[role=dialog]');
  check('destination modal opens', await page.locator('[role=dialog] h2').isVisible());
  check('modal shows accessibility unverified text', (await page.locator('[role=dialog]').innerText()).includes('Information not verified'));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  check('modal closes with Escape', (await page.locator('[role=dialog]').count()) === 0);

  // Saved trips page
  await page.locator('.nav-link', { hasText: 'Saved Trips' }).click();
  await page.waitForTimeout(300);
  check('saved page lists 1 trip', (await page.locator('.saved-card').count()) === 1);
  await page.getByRole('button', { name: 'Open' }).click();
  await page.waitForSelector('.day-card');
  check('open saved trip shows 3 days', (await page.locator('.day-card').count()) === 3);
  await page.locator('.nav-link', { hasText: 'Saved Trips' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.waitForTimeout(200);
  check('delete leaves empty state', (await page.locator('.empty-state').count()) === 1);
  // clear-all with confirm (save two then clear)
  await page.evaluate(() => localStorage.setItem('yatraai.savedTrips.v1', '{corrupt'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.goto(BASE + '/#/saved');
  await page.waitForTimeout(300);
  check('corrupted localStorage does not crash', (await page.locator('.empty-state').count()) === 1);

  // Explore filters
  await page.goto(BASE + '/#/explore');
  await page.waitForTimeout(300);
  const all = await page.locator('.dest-card').count();
  check('explore shows >= 12 destinations', all >= 12, `${all}`);
  await page.fill('#dest-search', 'hampi');
  await page.waitForTimeout(200);
  check('search hampi -> 1 result', (await page.locator('.dest-card').count()) === 1);
  await page.fill('#dest-search', '');
  await page.selectOption('#cat-select', 'Beach');
  const beaches = await page.locator('.dest-card').count();
  check('category Beach filter works', beaches >= 1 && beaches < all, `${beaches}`);
  await page.getByRole('button', { name: 'Wildlife', exact: true }).click();
  await page.waitForTimeout(200);
  check('category+interest with no match shows empty state', (await page.locator('.empty-state').count()) === 1);
  await page.getByRole('button', { name: 'Clear filters' }).first().click();
  await page.waitForTimeout(200);
  check('clear filters restores all', (await page.locator('.dest-card').count()) === all);
  await page.locator('.dest-card').first().click();
  await page.waitForSelector('[role=dialog]');
  const mapHref = await page.locator('[role=dialog] a', { hasText: 'Open map search' }).getAttribute('href');
  check('map link is a legitimate maps search URL', /google\.com\/maps\/search\/\?api=1&query=/.test(mapHref));
  await page.screenshot({ path: `${OUT}/03-modal.png` });
  await page.getByRole('button', { name: 'Plan a trip with these interests' }).click();
  await page.waitForTimeout(300);
  check('plan-from-destination navigates to planner with form', page.url().endsWith('#/plan') && (await page.locator('#field-startingCity').count()) === 1);

  // Kannada guide
  await page.goto(BASE + '/#/guide');
  await page.waitForTimeout(300);
  const phrases = await page.locator('.phrase-card').count();
  check('guide shows >= 15 phrases', phrases >= 15, `${phrases}`);
  await page.fill('#phrase-search', 'bus');
  await page.waitForTimeout(200);
  const busN = await page.locator('.phrase-card').count();
  check('phrase search "bus" narrows results', busN >= 1 && busN < phrases, `${busN}`);
  await page.getByRole('button', { name: 'Clear', exact: true }).click();
  await page.getByRole('button', { name: 'Food', exact: true }).click();
  await page.waitForTimeout(200);
  check('phrase category Food filter', (await page.locator('.phrase-card .cat').allTextContents()).every((c) => c === 'Food'));
  check('Kannada script renders in DOM', (await page.locator('.phrase-card .kannada').first().textContent()).length > 0);
  await page.screenshot({ path: `${OUT}/04-guide.png`, fullPage: true });

  // Responsive checks: overflow and mobile nav
  for (const w of [360, 390, 768, 1024]) {
    const mctx = await browser.newContext({ viewport: { width: w, height: 800 }, isMobile: w < 800, hasTouch: w < 800 });
    const mp = await mctx.newPage();
    const errs = [];
    mp.on('pageerror', (e) => errs.push(e.message));
    for (const r of ['home', 'plan', 'explore', 'guide', 'saved']) {
      await mp.goto(`${BASE}/#/${r}`, { waitUntil: 'networkidle' });
      await mp.waitForTimeout(200);
      const over = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check(`no horizontal overflow @${w}px on ${r}`, over <= 0, `${over}px`);
    }
    if (w < 900) {
      await mp.goto(`${BASE}/#/home`);
      const toggle = mp.getByRole('button', { name: 'Open menu' });
      check(`mobile menu toggle visible @${w}`, await toggle.isVisible());
      await toggle.click();
      await mp.locator('.nav-link', { hasText: 'Kannada Guide' }).click();
      await mp.waitForTimeout(200);
      check(`mobile nav navigates @${w}`, mp.url().endsWith('#/guide'));
    }
    // generate a trip on mobile and screenshot
    if (w === 390) {
      await mp.goto(`${BASE}/#/plan`);
      await mp.fill('#field-startingCity', 'Mysuru');
      await mp.fill('#field-budget', '15000');
      await mp.getByRole('button', { name: 'Generate My Trip' }).click();
      await mp.waitForSelector('.day-card', { timeout: 10000 });
      const over = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check('no horizontal overflow @390 with itinerary', over <= 0, `${over}px`);
      await mp.screenshot({ path: `${OUT}/05-mobile-itinerary.png`, fullPage: true });
      await mp.goto(`${BASE}/#/home`);
      await mp.screenshot({ path: `${OUT}/06-mobile-home.png`, fullPage: true });
    }
    check(`no page errors @${w}`, errs.length === 0, errs.join(' | '));
    await mctx.close();
  }

  // Image fallback
  await page.goto(BASE + '/#/explore');
  await page.evaluate(() => { const img = document.querySelector('.dest-card img'); img.src = '/images/does-not-exist.jpg'; });
  await page.waitForTimeout(500);
  check('broken image falls back to placeholder', (await page.locator('.img-fallback').count()) >= 1);

  // 404s for /api/* are expected under 'vite preview' (no serverless functions there)
  const realErrors = consoleErrors.filter((e) => !/favicon|does-not-exist|status of 404/.test(e));
  check('no console errors across flows', realErrors.length === 0, realErrors.slice(0, 3).join(' | '));

  await browser.close();
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
})().catch((e) => { console.error('E2E crashed:', e); process.exit(2); });
