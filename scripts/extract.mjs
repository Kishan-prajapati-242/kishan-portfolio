// Pull real computed styles off a reference page so the rebuild uses measured
// values instead of guesses.
//
//   node scripts/extract.mjs <url>

import { chromium } from 'playwright';

const url = process.argv[2];
if (!url) {
  console.error('usage: node scripts/extract.mjs <url>');
  process.exit(1);
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate(() => document.fonts?.ready);
await page.waitForTimeout(1200);

const data = await page.evaluate(() => {
  const seen = new Map();
  const bgs = new Map();
  const radii = new Map();
  const sticky = [];

  const text = (el) => (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 46);

  for (const el of document.querySelectorAll('*')) {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();

    if (s.position === 'sticky' || s.position === 'fixed') {
      sticky.push({
        tag: el.tagName.toLowerCase(),
        position: s.position,
        top: s.top,
        width: Math.round(r.width),
        height: Math.round(r.height),
        sample: text(el).slice(0, 30),
      });
    }

    if (s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)') {
      const k = s.backgroundColor;
      bgs.set(k, (bgs.get(k) || 0) + 1);
    }

    if (s.borderRadius && s.borderRadius !== '0px') {
      radii.set(s.borderRadius, (radii.get(s.borderRadius) || 0) + 1);
    }

    // Only elements that directly own text
    const owns = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!owns || r.width === 0) continue;

    const key = [
      s.fontFamily.split(',')[0].replace(/["']/g, ''),
      s.fontSize,
      s.fontWeight,
      s.letterSpacing,
      s.lineHeight,
      s.textTransform,
      s.color,
    ].join(' | ');

    if (!seen.has(key)) {
      seen.set(key, { key, count: 0, sample: text(el), tag: el.tagName.toLowerCase() });
    }
    seen.get(key).count++;
  }

  const roots = getComputedStyle(document.documentElement);
  const vars = [];
  for (let i = 0; i < roots.length; i++) {
    const p = roots[i];
    if (p.startsWith('--')) vars.push(`${p}: ${roots.getPropertyValue(p).trim()}`);
  }

  return {
    typography: [...seen.values()].sort((a, b) => b.count - a.count),
    backgrounds: [...bgs.entries()].sort((a, b) => b[1] - a[1]),
    radii: [...radii.entries()].sort((a, b) => b[1] - a[1]),
    sticky,
    vars,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    bodyFont: getComputedStyle(document.body).fontFamily,
    pageWidth: document.body.scrollWidth,
  };
});

console.log(`\n### ${url}`);
console.log(`body background: ${data.bodyBg}`);
console.log(`body font stack: ${data.bodyFont}`);
console.log(`\n--- typography, most used first ---`);
console.log('family | size | weight | tracking | leading | transform | colour   [count]  sample');
for (const t of data.typography.slice(0, 26)) {
  console.log(`${t.key}   [${t.count}]  ${t.tag}: "${t.sample}"`);
}
console.log(`\n--- background colours ---`);
for (const [c, n] of data.backgrounds.slice(0, 14)) console.log(`${c}  x${n}`);
console.log(`\n--- border radii ---`);
for (const [c, n] of data.radii.slice(0, 12)) console.log(`${c}  x${n}`);
console.log(`\n--- sticky and fixed elements ---`);
for (const s of data.sticky.slice(0, 12)) console.log(JSON.stringify(s));
if (data.vars.length) {
  console.log(`\n--- custom properties on :root ---`);
  for (const v of data.vars.slice(0, 40)) console.log(v);
}

await browser.close();
