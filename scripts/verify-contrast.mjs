// Reports the worst contrast ratio that actually occurs on every route in both themes.
// Run against a served build: npm run build && npx serve dist -l 4321
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:4321';
const AA = 4.5;
const AA_LARGE = 3.0;

const routes = ['/', '/work', '/work/sieve', '/work/gatekeepnt', '/work/calendar',
  '/work/moodlens', '/work/moodinsight', '/papers', '/teaching', '/notes',
  '/about', '/contact', '/404'];

// Two known failures, reported separately so they neither fail the run nor vanish.
const KNOWN = [
  { match: (r) => r.sel.includes('null-word') || r.sel.includes('null-bracket'),
    why: 'unmeasured state, --color-null renders the word null at 16px' },
  { match: (r) => r.sel.includes('line-in') && r.ratio < 2,
    why: 'ghosted display line, 18 percent of ink by design' },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const findings = [];
const known = [];

for (const theme of ['light', 'dark']) {
  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: 'load' });
    await page.evaluate((t) => document.documentElement.classList.toggle('dark', t === 'dark'), theme);
    // Let reveals settle, so nothing is sampled mid-fade.
    await page.waitForTimeout(2200);

    const rows = await page.evaluate(() => {
      // Paint into a canvas and read it back. color-mix() and oklab() values do not parse as rgb().
      const cv = document.createElement('canvas');
      cv.width = cv.height = 1;
      const ctx = cv.getContext('2d', { willReadFrequently: true });
      const parse = (c) => {
        if (!c) return null;
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = '#000';
        ctx.fillStyle = c;
        const resolved = ctx.fillStyle;
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = resolved;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
        return { r, g, b, a: a / 255 };
      };
      const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
      const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
      const ratio = (a, b) => {
        const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
        return (x + 0.05) / (y + 0.05);
      };
      const hex = (c) => '#' + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

      const over = (fg, bg) => ({
        r: fg.r * fg.a + bg.r * (1 - fg.a),
        g: fg.g * fg.a + bg.g * (1 - fg.a),
        b: fg.b * fg.a + bg.b * (1 - fg.a),
        a: 1,
      });

      const bgOf = (el) => {
        let node = el;
        let stack = [];
        while (node) {
          const c = parse(getComputedStyle(node).backgroundColor);
          if (c && c.a > 0) {
            stack.push(c);
            if (c.a >= 1) break;
          }
          node = node.parentElement;
        }
        let base = { r: 255, g: 255, b: 255, a: 1 };
        for (let i = stack.length - 1; i >= 0; i -= 1) base = over(stack[i], base);
        return base;
      };

      const out = [];
      for (const el of document.querySelectorAll('body *')) {
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (!own) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (el.closest('.sr-only') || el.classList.contains('sr-only')) continue;
        if (parseFloat(cs.opacity) < 0.99) continue;
        const fg = parse(cs.color);
        if (!fg || fg.a === 0) continue;

        const bg = bgOf(el);
        const composited = fg.a < 1 ? over(fg, bg) : fg;
        const px = parseFloat(cs.fontSize);
        const bold = parseInt(cs.fontWeight, 10) >= 700;
        const large = px >= 24 || (px >= 18.66 && bold);
        out.push({
          ratio: ratio(composited, bg),
          large,
          fg: hex(composited),
          bg: hex(bg),
          px: Math.round(px),
          sel: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''),
          text: (el.textContent || '').trim().slice(0, 32),
        });
      }
      return out;
    });

    for (const r of rows) {
      const need = r.large ? 3.0 : 4.5;
      const exception = KNOWN.find((k) => k.match(r));
      if (r.ratio < need) {
        if (exception) known.push({ theme, route, need, why: exception.why, ...r });
        else findings.push({ theme, route, need, ...r });
      }
    }
    (globalThis.__worst ??= {});
    const normals = rows.filter((r) => !r.large && !KNOWN.some((k) => k.match(r)));
    const wn = normals.reduce((a, b) => (b.ratio < a.ratio ? b : a), normals[0]);
    if (wn && (!globalThis.__worst[theme] || wn.ratio < globalThis.__worst[theme].ratio)) {
      globalThis.__worst[theme] = { ...wn, route };
    }
  }
}

console.log('WORST NORMAL-SIZE TEXT PAIR THAT ACTUALLY OCCURS, known exceptions excluded');
for (const theme of ['light', 'dark']) {
  const w = globalThis.__worst?.[theme];
  if (!w) { console.log(`  ${theme}: nothing measured`); continue; }
  console.log(
    `  ${theme.padEnd(6)} ${w.ratio.toFixed(2)}:1   ${w.fg} on ${w.bg}   ${w.px}px   ${w.route}   ${w.sel}`
  );
}

console.log(`\nFAILURES (AA ${AA} normal, ${AA_LARGE} large)`);
if (!findings.length) console.log(`  none across ${routes.length} routes in both themes`);
const seen = new Set();
for (const f of findings) {
  const key = `${f.theme}|${f.sel}|${f.fg}|${f.bg}`;
  if (seen.has(key)) continue;
  seen.add(key);
  console.log(`  ${f.theme}/${f.route}  ${f.ratio.toFixed(2)} < ${f.need}  ${f.fg} on ${f.bg}  ${f.px}px  ${f.sel}  "${f.text}"`);
}

console.log('\nKNOWN EXCEPTIONS, left as they are on purpose');
const seenK = new Set();
for (const k of known) {
  const key = `${k.theme}|${k.sel}`;
  if (seenK.has(key)) continue;
  seenK.add(key);
  console.log(`  ${k.theme.padEnd(6)} ${k.ratio.toFixed(2)} < ${k.need}  ${k.sel}  ${k.why}`);
}

await browser.close();
process.exit(findings.length ? 1 : 0);
