// Fails on console errors, page errors and failed requests on every route, and on SVG paths
// with percentages. Run against a served build: npm run build && npx serve dist -l 4321
import { chromium } from 'playwright';
import { readdir, readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const BASE = process.env.BASE || 'http://localhost:4321';
const WIDTHS = [1440, 390];
const ROUTES = ['/', '/work', '/work/sieve', '/work/gatekeepnt', '/work/calendar',
  '/work/moodlens', '/work/moodinsight', '/papers', '/teaching', '/notes',
  '/about', '/contact', '/404'];

// Client-side navigation, where a script that runs twice throws.
const NAV_PATH = ['/work', '/papers', '/about', '/contact'];

// Allowed by exact URL, never by status code, so a real missing asset still fails.
const ALLOWED_FAILED_REQUESTS = [
  {
    match: (url) => url.endsWith('/_vercel/insights/script.js'),
    why: 'Vercel Web Analytics, served by the platform edge and absent off it',
  },
];

// Only literal d attributes are checked. d={icon.d} and template literals are invisible to this.
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
    // \bd, so id= and data-d= do not match.
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

const staticProblems = await staticPathScan();

const browser = await chromium.launch();
const errors = [];
const warnings = [];

for (const width of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width, height: width < 500 ? 844 : 1000 },
    isMobile: width < 500,
    // A realistic UA. Some third parties answer HeadlessChrome differently.
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  let where = { route: '(startup)', width };
  const note = (bucket, text) => {
    bucket.push({ ...where, text: String(text).replace(/\s+/g, ' ').slice(0, 220) });
  };

  page.on('console', (msg) => {
    // A failed resource's URL is on msg.location(), not in the text, so the allowlist checks it here.
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

  where = { route: '(client-side navigation)', width };
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.waitForTimeout(400);
  for (const href of NAV_PATH) {
    where = { route: `(navigate to ${href})`, width };
    // Below 1024px the links sit behind the nav toggle.
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
