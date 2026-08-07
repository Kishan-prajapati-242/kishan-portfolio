// Reads back what the browser actually resolves for every animated element,
// so the audit table in DESIGN.md section 7 is measured rather than read off
// the source. Source order plus Astro's scoped-style specificity means the
// declaration you can see is not always the one that wins.
//
//   npm run build && npx serve dist -l 4321
//   node scripts/audit-motion.mjs
//
// Reports duration, iteration count, timeline and range per selector, and
// flags the two failure shapes that do not show up in a screenshot: an
// animation on the time clock with a 0s duration, and a time-clock animation
// whose timeline has been overridden to view() on an element that is already
// in view at load.

import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:4321';

// Selector, and a route that is known to contain it.
const TARGETS = [
  ['.site-header', '/'],
  ['.profile', '/'],
  ['.profile .portrait', '/'],
  ['.display .line-in', '/'],
  ['.display-lede', '/'],
  ['.illuminate .word', '/'],
  ['.stats > li', '/'],
  ['.stats > li:nth-child(4)', '/'],
  ['.stat-value', '/'],
  ['.stats > li:nth-child(4) .stat-value', '/'],
  ['.counter-group', '/'],
  ['.focus > *', '/'],
  ['.marquee-track', '/'],
  ['.divider-path', '/'],
  ['.scroll-progress', '/'],
  ['.home-link', '/'],
  ['.section', '/'],
  ['.card-grid > *', '/work/'],
  ['.section-h .line-in', '/work/'],
  ['.project-card .art img', '/work/'],
  ['.beam::after', '/work/'],
  ['.reveal', '/about/'],
  ['.reveal-text', '/about/'],
  ['.reveal-label', '/about/'],
  ['.skills .item', '/about/'],
  ['.rows > .row', '/papers/'],
  ['.prose .data-table', '/notes/'],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const byRoute = new Map();
for (const [sel, route] of TARGETS) {
  if (!byRoute.has(route)) byRoute.set(route, []);
  byRoute.get(route).push(sel);
}

const rows = [];
for (const [route, sels] of byRoute) {
  await page.goto(BASE + route, { waitUntil: 'load' });
  rows.push(
    ...(await page.evaluate((list) => {
      const out = [];
      for (const sel of list) {
        const [base, pseudo] = sel.split('::');
        const el = document.querySelector(base);
        if (!el) {
          out.push({ sel, note: 'NOT PRESENT' });
          continue;
        }
        const cs = getComputedStyle(el, pseudo ? '::' + pseudo : undefined);
        if (cs.animationName === 'none') {
          out.push({ sel, note: 'animation: none' });
          continue;
        }
        out.push({
          sel,
          name: cs.animationName,
          dur: cs.animationDuration,
          count: cs.animationIterationCount,
          ease: cs.animationTimingFunction,
          delay: cs.animationDelay,
          timeline: cs.animationTimeline,
          range: `${cs.animationRangeStart} ${cs.animationRangeEnd}`.trim(),
        });
      }
      return out;
    }, sels))
  );
}

const w = (s, n) => String(s).padEnd(n);
console.log(
  `${w('SELECTOR', 34)}${w('KEYFRAMES', 20)}${w('DUR', 9)}${w('N', 9)}${w('DELAY', 8)}${w('TIMELINE', 24)}RANGE`
);
console.log('-'.repeat(130));

// Two things legitimately break the general rules, and both are listed here so
// that anything else showing the same shape is a real finding.
//   .marquee-track   the only permitted infinite loop on the site
//   .scroll-progress the only thing whose subject genuinely is the whole
//                    document, because it reports progress through it
const EXPECTED_INFINITE = new Set(['.marquee-track']);
const EXPECTED_FULL_DOCUMENT = new Set(['.scroll-progress']);

const flags = [];
for (const r of rows) {
  if (r.note) {
    console.log(`${w(r.sel, 34)}${r.note}`);
    continue;
  }
  console.log(
    `${w(r.sel, 34)}${w(r.name, 20)}${w(r.dur, 9)}${w(r.count, 9)}${w(r.delay, 8)}${w(r.timeline, 24)}${r.range}`
  );
  const timeClock = /^auto(,\s*auto)*$/.test(r.timeline);
  if (timeClock && /^0s(,\s*0s)*$/.test(r.dur)) {
    flags.push(`${r.sel}: time clock with a 0s duration, so it snaps instead of animating`);
  }
  if (timeClock && r.range && r.range !== 'normal normal') {
    flags.push(`${r.sel}: animation-range set on a time clock, where it is inert`);
  }
  if (r.count.includes('infinite') && !EXPECTED_INFINITE.has(r.sel)) {
    flags.push(`${r.sel}: loops infinitely (${r.dur})`);
  }
  if (
    r.timeline.includes('scroll(root)') &&
    /^(normal normal|0% 100%)$/.test(r.range) &&
    !EXPECTED_FULL_DOCUMENT.has(r.sel)
  ) {
    flags.push(`${r.sel}: scroll(root) over the full document length`);
  }
}

console.log('\nFLAGS');
if (flags.length === 0) console.log('  none');
for (const f of flags) console.log(`  ${f}`);

// Does the hero h1 mask actually move on load? A view() timeline on an
// element that is already in view resolves as complete on the first frame.
await page.goto(BASE + '/', { waitUntil: 'commit' });
const samples = [];
for (const gap of [30, 120, 180, 400, 900]) {
  await page.waitForTimeout(gap);
  samples.push(
    await page.evaluate(() => ({
      t: performance.now() | 0,
      transform: getComputedStyle(document.querySelector('.display .line-in')).transform,
    }))
  );
}
console.log('\nHERO h1 .line-in transform over time (identity throughout means it never animates)');
for (const s of samples) console.log(`  ${String(s.t).padStart(5)}ms  ${s.transform}`);

// Shimmer sweep. Sampled over time, not over scroll: it used to run on
// scroll(root block) across the whole document, which meant it needed the
// entire page to cross two lines of type. It now runs once on the time clock
// as part of the hero sequence.
await page.goto(BASE + '/', { waitUntil: 'commit' });
console.log('\nh1 SHIMMER over time (one sweep, -20% to 120%)');
for (const gap of [30, 300, 400, 400, 500, 600]) {
  await page.waitForTimeout(gap);
  const s = await page.evaluate(() => ({
    t: performance.now() | 0,
    v: getComputedStyle(document.querySelector('.display .line-in'))
      .getPropertyValue('--shimmer')
      .trim(),
  }));
  console.log(`  ${String(s.t).padStart(5)}ms   --shimmer: ${s.v}`);
}

// Nothing on the time clock may still be moving once the page has settled.
// Scroll-driven animations are excluded because they report playState
// "running" whether or not the scroller is moving: their time is scroll
// position, so idle is a valid running state and not a finding.
await page.goto(BASE + '/', { waitUntil: 'load' });
await page.waitForTimeout(9000);
const stillMoving = await page.evaluate(() =>
  document
    .getAnimations()
    .filter((a) => a.playState === 'running' && a.effect)
    .filter((a) => !a.timeline || a.timeline === document.timeline)
    .map((a) => {
      const t = a.effect.target;
      const id = t ? `${t.tagName.toLowerCase()}.${[...t.classList].join('.')}` : '?';
      return `${a.animationName || '(unnamed)'} on ${id}`;
    })
);
console.log('\nSTILL ON THE TIME CLOCK 9s after load, with no scrolling');
if (stillMoving.length === 0) console.log('  nothing');
for (const s of new Set(stillMoving)) console.log(`  ${s}`);

await browser.close();
