// Reads back the animation values the browser actually resolves, which are not always the
// ones in the source. Run against a served build: npm run build && npx serve dist -l 4321
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

// The only two allowed to break the rules. Anything else with the same shape is a finding.
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

// The target zone is 45 to 80 percent of viewport height when a reveal completes.
console.log('\nWHERE REVEALS LAND, element centre as a percentage of viewport height when the reveal completes');
const LANDING = [
  ['/', '.card-grid:not(.focus) > *'],
  ['/work', '.rows > .row'],
  ['/work/sieve', '.prose > h2'],
  ['/work/gatekeepnt', '.prose > p'],
  ['/work/moodlens', '.prose > h2'],
  ['/papers', '.card-grid > *'],
  ['/teaching', '.card-grid > *'],
  ['/notes', '.story > h2'],
  ['/about', '.skills .item'],
];

let landingProblems = 0;
for (const [route, sel] of LANDING) {
  await page.goto(BASE + route, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const centres = await page.evaluate(async ({ sel }) => {
    const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const els = [...document.querySelectorAll(sel)].slice(0, 3);
    if (!els.length) return null;
    const max = document.documentElement.scrollHeight - innerHeight;
    const out = [];
    for (const el of els) {
      const a = el.getAnimations().find((x) => x.animationName && x.timeline !== document.timeline);
      if (!a) { out.push(null); continue; }
      let hit = null;
      for (let y = 0; y <= max; y += 40) {
        window.scrollTo(0, y);
        await frame();
        const prog = a.effect.getComputedTiming().progress;
        if (prog !== null && prog >= 0.995) {
          const r = el.getBoundingClientRect();
          hit = Math.round(((r.top + r.height / 2) / innerHeight) * 100);
          break;
        }
      }
      out.push(hit);
    }
    window.scrollTo(0, 0);
    return out;
  }, { sel });

  if (!centres) {
    landingProblems += 1;
    console.log(`  ${w(route, 20)}${w(sel, 28)} SELECTOR MATCHED NOTHING`);
    continue;
  }
  const found = centres.filter((c) => c !== null);
  const outside = found.filter((c) => c < 45 || c > 80);
  if (!found.length || outside.length) landingProblems += 1;
  console.log(
    `  ${w(route, 20)}${w(sel, 28)}${found.length ? found.map((c) => `${c}%`).join(', ') : 'no scroll-driven animation'}${outside.length ? '   OUTSIDE 45-80' : ''}`
  );
}
console.log(landingProblems === 0 ? '  all inside the target zone' : `  ${landingProblems} route(s) outside the target zone`);

console.log('\nPERSISTED SIDEBAR across client-side navigation');
await page.goto(BASE + '/', { waitUntil: 'load' });
await page.waitForTimeout(1800);
await page.evaluate(() => { document.querySelector('.profile').dataset.probe = 'orig'; });
for (const href of ['/papers', '/teaching', '/about']) {
  await page.click(`a[href="${href}"]`);
  await page.waitForTimeout(140);
  const r = await page.evaluate(() => {
    const el = document.querySelector('.profile');
    const cs = getComputedStyle(el);
    return {
      same: el.dataset.probe === 'orig',
      running: el.getAnimations().filter((a) => a.playState === 'running').map((a) => a.animationName),
      opacity: cs.opacity,
      transform: cs.transform,
    };
  });
  const clean = r.same && r.running.length === 0 && r.opacity === '1' && r.transform === 'none';
  console.log(
    `  ${w(href, 12)}node persisted: ${r.same}   replaying: ${r.running.join(',') || 'nothing'}   opacity ${r.opacity}   ${clean ? 'OK' : 'PROBLEM'}`
  );
}

// Uses documentElement.scrollWidth. Element boxes report their size even when an ancestor clips them.
console.log('\nHORIZONTAL OVERFLOW at narrow widths');
{
  const NARROW = [320, 375, 390];
  const ROUTES = ['/', '/work', '/work/sieve', '/work/gatekeepnt', '/work/calendar',
    '/work/moodlens', '/work/moodinsight', '/papers', '/teaching', '/notes',
    '/about', '/contact', '/404'];
  let overflowing = 0;
  for (const vw of NARROW) {
    const narrow = await browser.newPage({ viewport: { width: vw, height: 844 } });
    for (const route of ROUTES) {
      await narrow.goto(BASE + route, { waitUntil: 'load' });
      await narrow.waitForTimeout(400);
      const r = await narrow.evaluate((width) => {
        const scrollWidth = document.documentElement.scrollWidth;
        if (scrollWidth <= width + 1) return { scrollWidth, offenders: [] };
        const clipped = (el) => {
          for (let n = el.parentElement; n; n = n.parentElement) {
            if (/hidden|clip|auto|scroll/.test(getComputedStyle(n).overflowX)) return true;
          }
          return false;
        };
        const offenders = [];
        for (const el of document.querySelectorAll('body *')) {
          const b = el.getBoundingClientRect();
          if (b.width === 0 || b.right <= width + 1) continue;
          if (getComputedStyle(el).position === 'fixed') continue;
          if (clipped(el)) continue;
          offenders.push({
            sel: el.tagName.toLowerCase() +
              (typeof el.className === 'string' && el.className
                ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''),
            right: Math.round(b.right),
            text: (el.textContent || '').trim().slice(0, 30),
          });
        }
        return { scrollWidth, offenders };
      }, vw);
      if (r.scrollWidth > vw + 1) {
        overflowing += 1;
        console.log(`  ${String(vw).padStart(4)}px ${w(route, 20)}scrollWidth ${r.scrollWidth}`);
        const seen = new Set();
        for (const o of r.offenders) {
          if (seen.has(o.sel) || seen.size >= 4) continue;
          seen.add(o.sel);
          console.log(`         ${o.sel} right=${o.right} "${o.text}"`);
        }
        if (!r.offenders.length) {
          console.log('         no unclipped offender, look at padding or a fixed-width child');
        }
      }
    }
    await narrow.close();
  }
  console.log(overflowing === 0
    ? '  no route overflows at 320, 375 or 390'
    : `  ${overflowing} route and width combinations overflow`);
}

// Scroll-driven animations always report running, so only time-clock ones count here.
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
      return { name: a.animationName || '(unnamed)', where: `${a.animationName || '(unnamed)'} on ${id}` };
    })
);

// Allowlisted by name, so a new endless animation still shows up.
const EXPECTED_FOREVER = new Set(['marquee-left', 'marquee-right']);

const unexpected = [...new Set(stillMoving.filter((s) => !EXPECTED_FOREVER.has(s.name)).map((s) => s.where))];
const expected = [...new Set(stillMoving.filter((s) => EXPECTED_FOREVER.has(s.name)).map((s) => s.where))];

console.log('\nSTILL ON THE TIME CLOCK 9s after load, with no scrolling');
if (unexpected.length === 0) {
  console.log('  nothing unexpected');
} else {
  for (const s of unexpected) console.log(`  ${s}`);
}
for (const s of expected) console.log(`  allowlisted, the skills marquee: ${s}`);

await browser.close();
