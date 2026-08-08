// Hovers and keyboard-focuses every interactive element and reads back what
// actually changed, so "the hover is layered" is a measurement rather than a
// claim.
//
//   npm run build && npx serve dist -l 4321
//   node scripts/verify-hover.mjs
//
// Two things are checked that a screenshot cannot show: that the parts of one
// gesture share a duration and a delay, so they arrive together rather than
// staggered, and that the same gesture fires from the keyboard.

import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:4321';
let failures = 0;

const ok = (label, pass, detail = '') => {
  if (!pass) failures += 1;
  console.log(`  ${pass ? 'PASS' : 'FAIL'}  ${label}${detail ? `   ${detail}` : ''}`);
};

const browser = await chromium.launch();

// The site header is sticky with z-index 50, so an element scrolled to the top
// of the viewport sits underneath it and the pointer lands on the header
// instead. Centring the target first is the difference between testing the
// hover and testing the header.
async function hoverCentred(page, sel) {
  await page.evaluate((s) => {
    document.querySelector(s)?.scrollIntoView({ block: 'center', behavior: 'instant' });
  }, sel);
  await page.waitForTimeout(120);
  await page.hover(sel);
  await page.waitForTimeout(400);
  return page.evaluate((s) => document.querySelector(s)?.matches(':hover') ?? false, sel);
}

// Tabs until the focused element matches, so the count of intervening focus
// stops does not have to be hardcoded.
async function tabTo(page, sel, limit = 25) {
  for (let i = 0; i < limit; i += 1) {
    await page.keyboard.press('Tab');
    const hit = await page.evaluate((s) => document.activeElement?.matches(s) ?? false, sel);
    if (hit) return true;
  }
  return false;
}

async function styles(page, sel, props, pseudo) {
  return page.evaluate(
    ({ sel, props, pseudo }) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el, pseudo || undefined);
      return Object.fromEntries(props.map((p) => [p, cs.getPropertyValue(p)]));
    },
    { sel, props, pseudo }
  );
}

// ---- Project card, four parts of one gesture ------------------------------

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(BASE + '/work/', { waitUntil: 'load' });
  console.log('\nPROJECT CARD, four parts on one clock');

  const card = '.project-card';
  // The card art PNGs are not in the repo yet, so the image half of the
  // gesture can only be checked when a file happens to be present. Drop one
  // into src/assets/work/ and this stops skipping.
  const hasArt = (await page.$(`${card} .art img`)) !== null;
  if (!hasArt) console.log('  NOTE  no card art file present, image checks will skip');

  const rest = {
    card: await styles(page, card, ['translate', 'border-color']),
    img: await styles(page, `${card} .art img`, ['scale', 'filter']),
    arrow: await styles(page, `${card} .more a`, ['translate'], '::after'),
  };

  await hoverCentred(page, `${card} .title a`);

  const hov = {
    card: await styles(page, card, ['translate', 'border-color']),
    img: await styles(page, `${card} .art img`, ['scale', 'filter']),
    arrow: await styles(page, `${card} .more a`, ['translate'], '::after'),
  };

  ok('card lifts', rest.card.translate !== hov.card.translate, `${rest.card.translate} -> ${hov.card.translate}`);
  ok('border takes the accent', rest.card['border-color'] !== hov.card['border-color'], `${rest.card['border-color']} -> ${hov.card['border-color']}`);
  if (hasArt) {
    ok('image zooms', rest.img.scale !== hov.img.scale, `${rest.img.scale} -> ${hov.img.scale}`);
    ok('image saturates', rest.img.filter !== hov.img.filter, `${rest.img.filter} -> ${hov.img.filter}`);
  } else {
    console.log('  SKIP  image zooms, no art file');
    console.log('  SKIP  image saturates, no art file');
  }
  ok('arrow nudges', rest.arrow.translate !== hov.arrow.translate, `${rest.arrow.translate} -> ${hov.arrow.translate}`);

  // Together, not staggered.
  const timings = await page.evaluate(() => {
    const card = document.querySelector('.project-card');
    const img = card.querySelector('.art img');
    const arrow = card.querySelector('.more a');
    const read = (el, pseudo) => {
      if (!el) return { dur: [], delay: [], ease: '' };
      const cs = getComputedStyle(el, pseudo);
      return {
        dur: cs.transitionDuration.split(',').map((s) => s.trim()),
        delay: cs.transitionDelay.split(',').map((s) => s.trim()),
        ease: cs.transitionTimingFunction,
      };
    };
    return { card: read(card), img: read(img), arrow: read(arrow, '::after') };
  });
  const allDur = [...timings.card.dur, ...timings.img.dur, ...timings.arrow.dur];
  const allDelay = [...timings.card.delay, ...timings.img.delay, ...timings.arrow.delay];
  ok('one duration across all four', new Set(allDur).size === 1, [...new Set(allDur)].join(', '));
  ok('no stagger, every delay 0s', allDelay.every((d) => d === '0s'), [...new Set(allDelay)].join(', '));
  ok('spring easing on the gesture', timings.card.ease.startsWith('linear('), timings.card.ease.slice(0, 46) + '...');

  // Keyboard. Tabbing is what sets :focus-visible; element.focus() from script
  // does not, which is the whole point of the pseudo-class.
  await page.mouse.move(0, 0);
  await page.waitForTimeout(500);
  const cleared = await styles(page, card, ['translate']);
  ok('resets when the pointer leaves', cleared.translate === rest.card.translate, cleared.translate);

  const reached = await tabTo(page, `${card} .title a`);
  ok('the card title is reachable by keyboard', reached);
  await page.waitForTimeout(500);
  // Read the card that actually holds focus rather than the first one in the
  // document. Chromium resumes sequential focus navigation from the current
  // scroll position, so after a scroll the first Tab does not necessarily land
  // in the first card.
  const kb = await page.evaluate(() => {
    const c = document.activeElement.closest('.project-card');
    const img = c.querySelector('.art img');
    return {
      index: [...document.querySelectorAll('.project-card')].indexOf(c),
      focusVisible: document.activeElement.matches(':focus-visible'),
      translate: getComputedStyle(c).translate,
      scale: img ? getComputedStyle(img).scale : 'no art file',
      arrow: getComputedStyle(c.querySelector('.more a'), '::after').translate,
    };
  });
  ok('focus is keyboard focus, not click focus', kb.focusVisible, `card ${kb.index}`);
  ok('keyboard focus lifts the card', kb.translate === hov.card.translate, kb.translate);
  if (hasArt) ok('keyboard focus zooms the image', kb.scale === hov.img.scale, kb.scale);
  else console.log('  SKIP  keyboard focus zooms the image, no art file');
  ok('keyboard focus nudges the arrow', kb.arrow === hov.arrow.translate, kb.arrow);

  // Ken Burns, Sieve only.
  console.log('\nKEN BURNS, the featured card only');
  await page.mouse.move(0, 0);
  await page.waitForTimeout(300);
  const beamSel = '.project-card.is-flagship .art img';
  const plainSel = '.project-card:not(.is-flagship) .art img';
  if (!(await page.$(beamSel))) {
    console.log('  SKIP  the featured card has no art file');
    await page.close();
  } else {
  await hoverCentred(page, '.project-card.is-flagship .title a');
  const beamAnim = await styles(page, beamSel, ['animation-name', 'animation-duration']);
  ok('featured card pans on hover', beamAnim['animation-name'] === 'ken-burns', `${beamAnim['animation-name']} ${beamAnim['animation-duration']}`);
  const plainExists = await page.$(plainSel);
  if (plainExists) {
    await hoverCentred(page, '.project-card:not(.is-flagship) .title a');
    const plainAnim = await styles(page, plainSel, ['animation-name']);
    ok('other cards do not pan', plainAnim['animation-name'] === 'none', plainAnim['animation-name']);
  } else {
    console.log('  SKIP  the other cards have no art file yet');
  }
  await page.close();
  }
}

// ---- Skill icons ----------------------------------------------------------

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(BASE + '/about/', { waitUntil: 'load' });
  console.log('\nSKILL ICONS');
  const restGlyph = await styles(page, '.skills .item .glyph', ['scale', 'color']);
  const restLabel = await styles(page, '.skills .item', ['color']);
  const hovering = await hoverCentred(page, '.skills .item');
  ok('the pointer actually reached the item', hovering);
  const hovGlyph = await styles(page, '.skills .item .glyph', ['scale', 'color']);
  const hovLabel = await styles(page, '.skills .item', ['color']);
  ok('icon scales', restGlyph.scale !== hovGlyph.scale, `${restGlyph.scale} -> ${hovGlyph.scale}`);
  ok('icon takes the accent', restGlyph.color !== hovGlyph.color, `${restGlyph.color} -> ${hovGlyph.color}`);
  ok('label brightens', restLabel.color !== hovLabel.color, `${restLabel.color} -> ${hovLabel.color}`);
  const t = await styles(page, '.skills .item .glyph', ['transition-delay', 'transition-timing-function']);
  ok('nothing staggered', /^0s(,\s*0s)*$/.test(t['transition-delay']), t['transition-delay']);
  ok('spring easing', t['transition-timing-function'].startsWith('linear('));
  await page.close();
}

// ---- Nav links, buttons, stat cells ---------------------------------------

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(BASE + '/', { waitUntil: 'load' });

  console.log('\nNAV LINKS');
  const restU = await styles(page, '.nav-link', ['transform', 'color'], '::after');
  const restColor = await styles(page, '.nav-link', ['color']);
  await page.hover('.nav-link');
  await page.waitForTimeout(400);
  const hovU = await styles(page, '.nav-link', ['transform'], '::after');
  const hovColor = await styles(page, '.nav-link', ['color']);
  ok('underline grows', restU.transform !== hovU.transform, `${restU.transform} -> ${hovU.transform}`);
  ok('origin is the left edge', hovU.transform === 'matrix(1, 0, 0, 1, 0, 0)', hovU.transform);
  ok('colour does not change', restColor.color === hovColor.color, restColor.color);

  await page.mouse.move(0, 0);
  const reachedNav = await tabTo(page, '.nav-link');
  ok('a nav link is reachable by keyboard', reachedNav);
  await page.waitForTimeout(300);
  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    return { cls: el.className, after: getComputedStyle(el, '::after').transform };
  });
  ok('underline grows on keyboard focus', focused.after === 'matrix(1, 0, 0, 1, 0, 0)', `${focused.cls} ${focused.after}`);

  console.log('\nBUTTONS');
  const restBtn = await styles(page, '#theme-toggle', ['opacity', 'animation-name'], '::after');
  await page.hover('#theme-toggle');
  await page.waitForTimeout(300);
  const hovBtn = await styles(page, '#theme-toggle', ['opacity', 'animation-name'], '::after');
  ok('beam sweeps on hover', restBtn['animation-name'] === 'none' && hovBtn['animation-name'] === 'sweep', `${restBtn['animation-name']} -> ${hovBtn['animation-name']}`);
  ok('beam runs once', (await styles(page, '#theme-toggle', ['animation-iteration-count'], '::after'))['animation-iteration-count'] === '1');
  // A synthetic mousedown does not set :active in Chromium. It has to be a
  // real input event through the CDP mouse.
  const box = await page.locator('#theme-toggle').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(250);
  const pressScale = (await styles(page, '#theme-toggle', ['scale'])).scale;
  // Release away from the button. A press and release on the same element is a
  // click, and this button switches the theme, which would leave every colour
  // read after this point in the dark palette.
  await page.mouse.move(2, 400);
  await page.mouse.up();
  await page.mouse.move(0, 0);
  ok('press scales down', pressScale !== 'none' && pressScale !== '1', pressScale);

  console.log('\nSTAT CELLS');
  const restStat = await styles(page, '.stat-cell', ['scale', 'box-shadow', 'border-color']);
  await hoverCentred(page, '.stat-cell');
  const hovStat = await styles(page, '.stat-cell', ['scale', 'box-shadow', 'border-color']);
  ok('cell scales', restStat.scale !== hovStat.scale, `${restStat.scale} -> ${hovStat.scale}`);
  ok('inset highlight appears', restStat['box-shadow'] !== hovStat['box-shadow'], hovStat['box-shadow']);
  ok('border takes the accent', restStat['border-color'] !== hovStat['border-color']);

  console.log('\nPROSE LINKS, unchanged by design');
  const proseT = await styles(page, '.more a', ['transition-property']);
  console.log(`  transition-property on a body link: ${proseT['transition-property']}`);
  await page.close();
}

// ---- Mobile nav, @starting-style ------------------------------------------

{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + '/', { waitUntil: 'load' });
  console.log('\nMOBILE NAV, open and close both animate');
  const closed = await styles(page, '#site-nav', ['display', 'opacity', 'transition-property']);
  ok('display is in the transition list', closed['transition-property'].includes('display'), closed['transition-property']);
  ok('closed is display none', closed.display === 'none', closed.display);

  await page.click('#nav-toggle');
  await page.waitForTimeout(20);
  const opening = await styles(page, '#site-nav', ['display', 'opacity']);
  ok('opening starts from transparent, not from nothing', Number(opening.opacity) < 0.9, `opacity ${opening.opacity} display ${opening.display}`);
  await page.waitForTimeout(500);
  const open = await styles(page, '#site-nav', ['display', 'opacity']);
  ok('lands fully open', open.opacity === '1' && open.display === 'flex', `opacity ${open.opacity} display ${open.display}`);

  await page.click('#nav-toggle');
  await page.waitForTimeout(80);
  const closing = await styles(page, '#site-nav', ['display', 'opacity']);
  ok('still painted while closing', closing.display === 'flex' && Number(closing.opacity) < 1, `opacity ${closing.opacity} display ${closing.display}`);
  await page.waitForTimeout(500);
  const shut = await styles(page, '#site-nav', ['display']);
  ok('ends at display none', shut.display === 'none', shut.display);
  await page.close();
}

// ---- Case study rail, interpolate-size -------------------------------------

{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + '/work/sieve/', { waitUntil: 'load' });
  console.log('\nCASE STUDY RAIL, height auto with no measuring script');
  const supported = await page.evaluate(
    () => CSS.supports('interpolate-size', 'allow-keywords') && CSS.supports('selector(::details-content)')
  );
  console.log(`  interpolate-size and ::details-content supported: ${supported}`);
  const openH = await page.evaluate(() => {
    const d = document.querySelector('.rail-index');
    d.open = true;
    return d.querySelector('.rail-list').getBoundingClientRect().height;
  });
  ok('index is readable when open', openH > 0, `${Math.round(openH)}px tall`);
  const linksVisible = await page.evaluate(
    () => [...document.querySelectorAll('[data-rail-link]')].filter((a) => a.getBoundingClientRect().height > 0).length
  );
  ok('every section link is reachable', linksVisible > 0, `${linksVisible} links`);
  await page.close();
}

// ---- Reduced motion --------------------------------------------------------

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await page.goto(BASE + '/work/', { waitUntil: 'load' });
  console.log('\nREDUCED MOTION, every hover static');
  await hoverCentred(page, '.project-card .title a');
  const rm = {
    card: await styles(page, '.project-card', ['translate']),
    img: await styles(page, '.project-card .art img', ['scale', 'animation-name']),
    arrow: await styles(page, '.project-card .more a', ['translate'], '::after'),
  };
  ok('card does not lift', rm.card.translate === 'none', rm.card.translate);
  if (rm.img) {
    ok('image does not zoom', rm.img.scale === 'none', rm.img.scale);
    ok('image does not pan', rm.img['animation-name'] === 'none', rm.img['animation-name']);
  } else {
    console.log('  SKIP  image checks, no art file');
  }
  ok('arrow does not nudge', rm.arrow.translate === 'none', rm.arrow.translate);

  await page.goto(BASE + '/', { waitUntil: 'load' });
  await hoverCentred(page, '.stat-cell');
  const rmStat = await styles(page, '.stat-cell', ['scale']);
  ok('stat cell does not scale', rmStat.scale === 'none', rmStat.scale);
  await page.hover('#theme-toggle');
  await page.waitForTimeout(300);
  const rmBtn = await styles(page, '#theme-toggle', ['animation-name', 'display'], '::after');
  ok('button beam is gone', rmBtn.display === 'none' || rmBtn['animation-name'] === 'none', `${rmBtn.display} ${rmBtn['animation-name']}`);
  const rmMarquee = await styles(page, '.marquee-track', ['animation-name', 'transform']);
  ok('marquee is static', rmMarquee['animation-name'] === 'none', rmMarquee['animation-name']);
  // The border beam was removed rather than fixed twice over, so this asserts
  // its absence: nothing may paint a ::after layer on the lead card.
  const rmBeam = await styles(page, '.is-flagship', ['content'], '::after');
  ok('the border beam is gone entirely', !rmBeam || rmBeam.content === 'none', rmBeam ? rmBeam.content : 'no lead card on this route');
  await page.close();
}

await browser.close();
console.log(`\n${failures === 0 ? 'ALL CHECKS PASS' : `${failures} CHECK(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
