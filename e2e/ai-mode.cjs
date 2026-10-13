const { chromium } = require('playwright');
const http = require('http');
const setMode = (m) => new Promise((r) => http.get(`http://localhost:9999/control?mode=${m}`, (res) => { res.resume(); res.on('end', r); }));
const results = []; const check = (n, ok, x='') => { results.push(ok); console.log(`${ok?'PASS':'FAIL'}  ${n}${x?'  -> '+x:''}`); };
(async () => {
  const b = await chromium.launch(); const page = await b.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await setMode('ok');
  await page.goto((process.env.BASE || 'http://localhost:5174')+'/#/plan', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const pill = await page.locator('.engine-pill').first().textContent();
  check('AI mode detected when key configured', /AI mode \(mock-model\)/.test(pill), pill.trim());
  await page.fill('#field-startingCity', 'Bengaluru'); await page.fill('#field-budget', '20000');
  await page.getByRole('button', { name: 'Generate My Trip' }).click();
  await page.waitForSelector('.day-card', { timeout: 15000 });
  const notice = await page.locator('.notice-warn').first().textContent();
  check('AI result labelled as AI-generated with model', /AI-generated itinerary \(model: mock-model\)/.test(notice), notice.slice(0, 60));
  check('AI result has 3 days', (await page.locator('.day-card').count()) === 3);
  check('AI tips section rendered', (await page.locator('text=Tips from the AI').count()) === 1);
  check('budget still computed by estimator', (await page.locator('.budget-foot').count()) === 1);
  check('AI-mapped destination resolved to dataset (Hampi)', (await page.locator('.day-card .where').first().textContent()).includes('Vijayanagara'));

  // Failure path
  await setMode('fail');
  await page.getByRole('button', { name: 'Edit & regenerate' }).click();
  await page.getByRole('button', { name: 'Generate My Trip' }).click();
  await page.waitForSelector('.notice-error', { timeout: 15000 });
  const err = await page.locator('.notice-error').textContent();
  check('AI failure shows error (no fake output)', /AI generation failed/.test(err) && /HTTP 500/.test(err), err.slice(0, 90));
  check('form values preserved after failure', (await page.inputValue('#field-budget')) === '20000');
  check('Retry and demo fallback buttons offered', (await page.getByRole('button', { name: 'Retry' }).count()) === 1 && (await page.getByRole('button', { name: 'Use demo mode instead' }).count()) === 1);
  // Retry still fails
  await page.getByRole('button', { name: 'Retry' }).click();
  await page.waitForSelector('.notice-error', { timeout: 15000 });
  check('retry while upstream down still errors honestly', (await page.locator('.notice-error').count()) === 1);
  // Explicit demo fallback
  await page.getByRole('button', { name: 'Use demo mode instead' }).click();
  await page.waitForSelector('.day-card', { timeout: 15000 });
  const n2 = await page.locator('.notice-warn').first().textContent();
  check('explicit demo fallback produces demo-labelled itinerary', /Demo itinerary/.test(n2));
  check('engine pill in result says demo (no AI)', /Demo generator \(no AI\)/.test(await page.locator('.engine-pill').nth(1).textContent()));
  // Garbage
  await setMode('garbage');
  await page.getByRole('button', { name: 'Edit & regenerate' }).click();
  await page.getByRole('button', { name: 'Generate My Trip' }).click();
  await page.waitForSelector('.notice-error', { timeout: 15000 });
  check('malformed AI output rejected gracefully', /could not be used/.test(await page.locator('.notice-error').textContent()));
  // Toggle switch to demo
  await page.locator('.switch input').uncheck();
  check('switch turns AI off', /Demo mode/.test(await page.locator('.engine-pill').first().textContent()));
  await page.getByRole('button', { name: 'Generate My Trip' }).click();
  await page.waitForSelector('.day-card', { timeout: 15000 });
  check('demo generation with AI switched off', /Demo itinerary/.test(await page.locator('.notice-warn').first().textContent()));
  check('no page errors in AI flows', errors.length === 0, errors.join('|'));
  // Secret must not be in client bundle/source served
  const src = await (await page.request.get((process.env.BASE || 'http://localhost:5174')+'/src/services/aiService.js')).text();
  check('no API key in client source', !src.includes('test-key'));
  await b.close();
  console.log(`\n${results.filter(Boolean).length}/${results.length} AI checks passed`);
  await setMode('ok');
  process.exit(results.every(Boolean) ? 0 : 1);
})().catch((e) => { console.error('crash', e); process.exit(2); });
