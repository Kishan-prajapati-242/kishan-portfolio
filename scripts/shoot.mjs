// Full-page screenshots for visual comparison work.
//
//   node scripts/shoot.mjs <url> <desktop.png> [mobile.png]
//
// Desktop is 1440x900, mobile is 390x844, both captured full page at 2x so
// type and hairlines are legible when read back. The page is scrolled to the
// bottom and back first, because scroll-triggered content will not render
// into a full-page shot otherwise.

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

const [url, desktopOut, mobileOut] = process.argv.slice(2);

if (!url || !desktopOut) {
  console.error('usage: node scripts/shoot.mjs <url> <desktop.png> [mobile.png]');
  process.exit(1);
}

// Framer reveals sections on scroll by animating opacity and transform. A
// full-page screenshot resizes the viewport, which re-arms those animations
// and captures blank bands. REVEAL=1 forces every element visible first.
async function reveal(page) {
  await page.addStyleTag({
    content: `*, *::before, *::after {
      opacity: 1 !important;
      transform: none !important;
      animation: none !important;
      transition: none !important;
      visibility: visible !important;
    }`,
  });
  await page.waitForTimeout(400);
}

async function settle(page) {
  // Walk the page so lazy images and scroll reveals commit, then return.
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        window.scrollTo(0, y);
        y += window.innerHeight;
        if (y < document.body.scrollHeight + window.innerHeight) {
          setTimeout(step, 60);
        } else {
          window.scrollTo(0, 0);
          setTimeout(resolve, 300);
        }
      };
      step();
    });
  });
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(600);
}

async function shoot(browser, viewport, out) {
  await mkdir(dirname(out), { recursive: true });
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 2,
    isMobile: viewport.width < 500,
    hasTouch: viewport.width < 500,
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() =>
    page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
  );
  await settle(page);
  if (process.env.REVEAL === '1') await reveal(page);
  await page.screenshot({ path: out, fullPage: true });
  const height = await page.evaluate(() => document.body.scrollHeight);
  console.log(`  ${out}  ${viewport.width}x${viewport.height}  page height ${height}px`);
  await context.close();
}

const browser = await chromium.launch();
try {
  await shoot(browser, VIEWPORTS.desktop, desktopOut);
  if (mobileOut) await shoot(browser, VIEWPORTS.mobile, mobileOut);
} finally {
  await browser.close();
}
