// Motion verification. Loads every route, scrolls through it, and reports any
// element that is carrying visible text while computed invisible.
//
//   node scripts/verify-motion.mjs <baseUrl> [mode]
//   mode: normal | reduced | nosupport

import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:4322';
const mode = process.argv[3] ?? 'normal';

const routes = ['/', '/work', '/work/sieve', '/work/gatekeepnt', '/work/atctm',
  '/work/moodlens', '/work/moodinsight', '/papers', '/teaching', '/notes',
  '/about', '/404'];

// Simulates a browser without scroll-driven animation support by neutralising
// every timeline, which is what the @supports fallback does.
const KILL_SUPPORT = `
  *, *::before, *::after { animation-timeline: auto !important; }
  .reveal, [class*="reveal"], .line-in, .card-grid > *, .rows > .row,
  .prose .data-table { opacity: 1 !important; transform: none !important; }
`;

const browser = await chromium.launch();
let problems = 0;

for (const [label, viewport] of [['1440', { width: 1440, height: 900 }], ['390', { width: 390, height: 844 }]]) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    isMobile: viewport.width < 500,
    reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference',
  });
  const page = await context.newPage();

  for (const route of routes) {
    await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
    if (mode === 'nosupport') await page.addStyleTag({ content: KILL_SUPPORT });
    await page.evaluate(() => document.fonts?.ready);

    // Walk the page the way a reader would, checking at each stop.
    const hidden = await page.evaluate(async () => {
      const bad = [];
      const seen = new Set();
      const check = () => {
        for (const el of document.querySelectorAll('main *, .profile *')) {
          const text = (el.textContent || '').trim();
          if (!text || el.children.length > 0) continue;
          const r = el.getBoundingClientRect();
          if (r.height === 0 || r.bottom < 0 || r.top > window.innerHeight) continue;
          const s = getComputedStyle(el);
          const invisible =
            parseFloat(s.opacity) < 0.05 ||
            (s.clipPath !== 'none' && /inset\([^)]*100%/.test(s.clipPath));
          const key = text.slice(0, 40);
          if (invisible && !seen.has(key)) {
            seen.add(key);
            bad.push({ text: key, opacity: s.opacity, clip: s.clipPath });
          }
        }
      };
      const step = Math.round(window.innerHeight * 0.75);
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 220));
        check();
      }
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 600));
      check();
      return bad;
    });

    if (hidden.length) {
      problems += hidden.length;
      console.log(`  ${mode}/${label} ${route}  ${hidden.length} STUCK INVISIBLE`);
      hidden.slice(0, 3).forEach((h) => console.log(`      "${h.text}" opacity=${h.opacity}`));
    }
  }
  await context.close();
}

console.log(problems === 0
  ? `  ${mode}: clean, nothing stuck invisible across ${routes.length} routes at both widths`
  : `  ${mode}: ${problems} stuck elements`);

await browser.close();
