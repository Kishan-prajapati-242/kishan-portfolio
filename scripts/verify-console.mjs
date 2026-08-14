// Catches things that are broken but silent.
//
//   npm run build && npx serve dist -l 4321
//   node scripts/verify-console.mjs
//
// This exists because of D-182. The section divider was not drawing from the
// day it was reinstated: its SVG path contained a percentage, which is not
// valid in path data, so the browser discarded the rest of the `d` attribute
// and every divider rendered as a lone 8px tick. Nothing caught it. The
// element is decorative and aria-hidden, so the visibility sweeps skip it, and
// it has no text for the contrast audit to measure. The browser was saying so
// on every page load and nobody was listening.
//
// Two passes:
//   1. a static scan for percentages inside SVG path data, which is the exact
//      shape of that bug and is free to check
//   2. every route at two widths, scrolled end to end and then navigated
//      through, with the console attached
//
// Errors and pageerrors fail the run. Warnings are printed but do not, because
// a gate that fails on warnings gets muted and then the errors go unread too.

import { chromium } from 'playwright';
import { readdir, readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const BASE = process.env.BASE || 'http://localhost:4321';
const WIDTHS = [1440, 390];
const ROUTES = ['/', '/work', '/work/sieve', '/work/gatekeepnt', '/work/atctm',
  '/work/moodlens', '/work/moodinsight', '/papers', '/teaching', '/notes',
  '/about', '/contact', '/404'];

// Clicked in order to exercise client-side navigation. The double-register
// class of bug, where a script runs twice and throws the second time, only
// shows up on a swap and never on first load.
const NAV_PATH = ['/work', '/papers', '/about', '/contact'];

// Allowed failures, by exact URL suffix rather than by status code. Muting 404s
// as a class would hide a genuinely missing asset, which is precisely the sort
// of thing this script is for.
const ALLOWED_FAILED_REQUESTS = [
  {
    match: (url) => url.endsWith('/_vercel/insights/script.js'),
    why: 'Vercel Web Analytics, served by the platform edge and absent off it',
  },
];

// ---------------------------------------------------------------------------
// Pass 1, static: percentages in SVG path data.
//
// The SVG path grammar takes numbers and nothing else. A percent sign inside a
// `d` attribute is always wrong, so this has no false positives to weigh up.
//
// The limit worth stating: it only sees literal attributes. `d={icon.d}` and
// anything built from a template literal are invisible to it, so this narrows
// the hole rather than closing it.
async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) await walk(p, out);
    else if (['.astro', '.svg', '.html', '.md', '.mdx', '.ts', '.tsx', '.js', '.jsx'].includes(extname(entry.name))) {
      out.push(p);
    }
  }
  return out;
}

async function staticPathScan() {
  console.log('STATIC: percentages in SVG path data');
  const files = await walk('src');
  const hits = [];
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    // \bd= rather than d=, so id=, data-d= and the like do not match: there is
    // no word boundary between the i and the d of id.
    for (const m of text.matchAll(/\bd\s*=\s*"([^"]*)"/g)) {
      if (!m[1].includes('%')) continue;
      const line = text.slice(0, m.index).split('\n').length;
      hits.push({ file, line, value: m[1].slice(0, 80) });
    }
  }
  for (const h of hits) console.log(`  ${h.file}:${h.line}  d="${h.value}"`);
  console.log(hits.length === 0
    ? `  clean across ${files.length} files`
    : `  ${hits.length} invalid path(s): percentages are not valid in path data`);
  return hits.length;
}

// ---------------------------------------------------------------------------
// Pass 2, runtime.
const staticProblems = await staticPathScan();

const browser = await chromium.launch();
const errors = [];
const warnings = [];

for (const width of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width, height: width < 500 ? 844 : 1000 },
    isMobile: width < 500,
    // A realistic UA. Playwright's default says HeadlessChrome, which some
    // third parties treat as a bot and answer differently, and then the run is
    // measuring the bot response rather than the site.
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  let where = { route: '(startup)', width };
  const note = (bucket, text) => {
    bucket.push({ ...where, text: String(text).replace(/\s+/g, ' ').slice(0, 220) });
  };

  page.on('console', (msg) => {
    // A console error for a failed resource says only "Failed to load
    // resource", with the URL on the message location rather than in the text.
    // Without this the allowlisted request is reported twice: once through the
    // response handler, where it is correctly suppressed, and once here, where
    // it looks like an unexplained 404 on every route.
    const from = msg.location()?.url ?? '';
    if (from && ALLOWED_FAILED_REQUESTS.some((a) => a.match(from))) return;
    const text = from ? `${msg.text()} (${from})` : msg.text();
    if (msg.type() === 'error') note(errors, text);
    else if (msg.type() === 'warning') note(warnings, text);
  });
  page.on('pageerror', (err) => note(errors, `pageerror: ${err.message}`));
  page.on('requestfailed', (req) => {
    const allowed = ALLOWED_FAILED_REQUESTS.find((a) => a.match(req.url()));
    if (allowed) return;
    note(errors, `request failed: ${req.url()} (${req.failure()?.errorText ?? 'unknown'})`);
  });
  page.on('response', (res) => {
    if (res.status() < 400) return;
    const allowed = ALLOWED_FAILED_REQUESTS.find((a) => a.match(res.url()));
    if (allowed) return;
    note(errors, `HTTP ${res.status()} for ${res.url()}`);
  });

  for (const route of ROUTES) {
    where = { route, width };
    await page.goto(BASE + route, { waitUntil: 'load' });
    // Scroll the whole page so scroll-driven work, lazy images and anything
    // that only runs below the fold actually runs.
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.6);
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 70));
      }
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 250));
    });
    await page.waitForTimeout(300);
  }

  // Client-side navigation.
  where = { route: '(client-side navigation)', width };
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.waitForTimeout(400);
  for (const href of NAV_PATH) {
    where = { route: `(navigate to ${href})`, width };
    // Below 1024px the nav collapses behind a toggle, so the links exist but
    // are not clickable until it is opened. Opening it is also worth doing:
    // it exercises the @starting-style open and close path on every hop.
    const toggle = page.locator('#nav-toggle');
    if (await toggle.isVisible().catch(() => false)) {
      await toggle.click();
      await page.waitForTimeout(400);
    }
    const link = page.locator(`a[href="${href}"]`).first();
    try {
      await link.click({ timeout: 5000 });
      await page.waitForTimeout(900);
    } catch {
      note(errors, `could not reach the nav link for ${href}, so this hop was not exercised`);
    }
  }

  await context.close();
}

await browser.close();

// ---------------------------------------------------------------------------
const dedupe = (list) => {
  const seen = new Map();
  for (const m of list) {
    const key = `${m.width}|${m.route}|${m.text}`;
    if (!seen.has(key)) seen.set(key, { ...m, count: 1 });
    else seen.get(key).count += 1;
  }
  return [...seen.values()];
};

const uniqueErrors = dedupe(errors);
const uniqueWarnings = dedupe(warnings);

console.log(`\nWARNINGS, visible but not fatal (${uniqueWarnings.length} unique)`);
if (uniqueWarnings.length === 0) console.log('  none');
for (const w of uniqueWarnings) {
  console.log(`  ${String(w.width).padStart(4)}px ${w.route.padEnd(28)} ${w.text}${w.count > 1 ? `  (x${w.count})` : ''}`);
}

console.log(`\nERRORS (${uniqueErrors.length} unique)`);
if (uniqueErrors.length === 0) console.log('  none');
for (const e of uniqueErrors) {
  console.log(`  ${String(e.width).padStart(4)}px ${e.route.padEnd(28)} ${e.text}${e.count > 1 ? `  (x${e.count})` : ''}`);
}

console.log(`\nallowlisted, not counted: ${ALLOWED_FAILED_REQUESTS.map((a) => a.why).join('; ')}`);

const failed = uniqueErrors.length + staticProblems;
console.log(failed === 0
  ? `\nclean across ${ROUTES.length} routes at ${WIDTHS.join(' and ')}`
  : `\n${failed} problem(s)`);
process.exit(failed === 0 ? 0 : 1);
