// Reports text that is still invisible after its reveal should have finished.
// Usage: node scripts/verify-motion.mjs <baseUrl> [normal | reduced | nosupport]
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:4322';
const mode = process.argv[3] ?? 'normal';

const routes = ['/', '/work', '/work/sieve', '/work/gatekeepnt', '/work/calendar',
  '/work/moodlens', '/work/moodinsight', '/papers', '/teaching', '/notes',
  '/about', '/contact', '/404'];

// Simulates no scroll-driven animation support, which is what the @supports fallback gets.
const KILL_SUPPORT = `
  *, *::before, *::after { animation-timeline: auto !important; }
  .reveal, [class*="reveal"], .line-in, .card-grid > *, .rows > .row,
  .prose .data-table, .data-table, .prose > *, .story > *, .skills .item,
  .skills .specialist .chip, .project-card .art .screen
  { opacity: 1 !important; transform: none !important; }
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

    // stuck: invisible at maximum scroll, always a bug. late: invisible while its centre
    // is in the top 80 percent of the viewport.
    const hidden = await page.evaluate(async () => {
      const bad = [];
      const seen = new Set();
      const isInvisible = (s) =>
        parseFloat(s.opacity) < 0.05 ||
        (s.clipPath !== 'none' && /inset\([^)]*100%/.test(s.clipPath));

      const check = (readingZoneOnly) => {
        for (const el of document.querySelectorAll('main *, .profile *')) {
          const text = (el.textContent || '').trim();
          if (!text || el.children.length > 0) continue;
          const r = el.getBoundingClientRect();
          if (r.height === 0 || r.bottom < 0 || r.top > window.innerHeight) continue;
          if (readingZoneOnly && r.top + r.height / 2 > window.innerHeight * 0.8) continue;
          const s = getComputedStyle(el);
          const key = text.slice(0, 40);
          if (isInvisible(s) && !seen.has(key)) {
            seen.add(key);
            bad.push({
              text: key,
              opacity: s.opacity,
              clip: s.clipPath,
              kind: readingZoneOnly ? 'late' : 'stuck',
              centrePct: Math.round(((r.top + r.height / 2) / window.innerHeight) * 100),
            });
          }
        }
      };

      const step = Math.round(window.innerHeight * 0.75);
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 260));
        check(true);
      }
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 700));
      check(false);
      return bad;
    });

    if (hidden.length) {
      problems += hidden.length;
      console.log(`  ${mode}/${label} ${route}  ${hidden.length} INVISIBLE`);
      hidden.slice(0, 4).forEach((h) =>
        console.log(`      [${h.kind}] "${h.text}" opacity=${h.opacity} centre=${h.centrePct}%`)
      );
    }
  }
  await context.close();
}

console.log(problems === 0
  ? `  ${mode}: clean, nothing stuck invisible across ${routes.length} routes at both widths`
  : `  ${mode}: ${problems} stuck elements`);

await browser.close();
