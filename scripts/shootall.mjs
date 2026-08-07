// Capture every route at both breakpoints in one browser session.
//
//   node scripts/shootall.mjs <baseUrl> <outDir> <prefix>

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const [base = 'http://localhost:4322', outDir = 'ref', prefix = 'p'] = process.argv.slice(2);

const routes = [
  ['/', 'home'],
  ['/work', 'work'],
  ['/work/sieve', 'sieve'],
  ['/work/gatekeepnt', 'gatekeepnt'],
  ['/work/atctm', 'atctm'],
  ['/work/moodlens', 'moodlens'],
  ['/work/moodinsight', 'moodinsight'],
  ['/papers', 'papers'],
  ['/teaching', 'teaching'],
  ['/notes', 'notes'],
  ['/about', 'about'],
  ['/404', '404'],
];

const VIEWPORTS = [
  ['d', { width: 1440, height: 900 }],
  ['m', { width: 390, height: 844 }],
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

for (const [suffix, viewport] of VIEWPORTS) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 2,
    isMobile: viewport.width < 500,
  });
  const page = await context.newPage();

  for (const [route, name] of routes) {
    await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(() => document.fonts?.ready);
    await page.waitForTimeout(250);
    const out = `${outDir}/${prefix}-${name}-${suffix}.png`;
    await page.screenshot({ path: out, fullPage: true });
    const [h, overflow] = await page.evaluate(() => [
      document.body.scrollHeight,
      document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ]);
    console.log(`  ${out}  height ${h}px${overflow ? '  HORIZONTAL OVERFLOW' : ''}`);
  }

  await context.close();
}

await browser.close();
