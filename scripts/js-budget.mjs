// Client JavaScript per route, gzipped, with each inline block attributed.
//
//   npm run build && node scripts/js-budget.mjs
//
// JSON-LD is counted separately. It is structured data the browser never
// executes, so folding it into a JavaScript budget flatters or penalises the
// number depending on which pages happen to carry it.

import { readFile, readdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { join, relative } from 'node:path';

const DIST = 'dist';
const CEILING = 16 * 1024;

// Matched against the source of each inline block, first hit wins.
const LABELS = [
  [/localStorage\.getItem\('theme'\).*classList\.toggle/s, 'theme, pre-paint'],
  [/astro:after-swap/, 'theme reapply plus data-navigated'],
  [/data-keycap/, 'keycap'],
  [/pointermove/, 'spotlight, delegated'],
  [/contact-form|web3forms/i, 'contact form plus copy button'],
  [/nav-toggle/, 'mobile nav'],
  [/theme-toggle/, 'theme toggle'],
  [/data-rail-link/, 'case study rail'],
  [/ViewTransition|astro:page-load/, 'router glue'],
];

const label = (src) => LABELS.find(([re]) => re.test(src))?.[1] ?? 'unlabelled';

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const pages = (await walk(DIST)).sort();
const rows = [];

for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const srcs = new Set([...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]));
  let ext = 0;
  for (const src of srcs) {
    try {
      ext += gzipSync(await readFile(join(DIST, src.replace(/^\//, '')))).length;
    } catch {}
  }

  let inline = 0;
  let ld = 0;
  const parts = [];
  for (const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    const attrs = m[1];
    const body = m[2];
    if (/src=/.test(attrs)) continue;
    if (!body.trim()) continue;
    const size = gzipSync(Buffer.from(body)).length;
    if (/ld\+json/.test(attrs)) { ld += size; continue; }
    inline += size;
    parts.push({ label: label(body), size });
  }

  rows.push({ route: '/' + relative(DIST, page), ext, inline, ld, total: ext + inline, parts });
}

rows.sort((a, b) => b.total - a.total);

console.log('route                          total    ext  inline   (ld+json)');
for (const r of rows) {
  console.log(
    `${r.route.padEnd(30)}${String(r.total).padStart(6)}${String(r.ext).padStart(7)}${String(r.inline).padStart(8)}${String(r.ld).padStart(11)}`
  );
}

const worst = rows[0];
console.log(`\nworst route: ${worst.route}, ${worst.total} bytes gzipped, ceiling ${CEILING}`);
console.log(`headroom: ${CEILING - worst.total} bytes\n`);
console.log(`inline blocks on ${worst.route}:`);
for (const p of worst.parts.sort((a, b) => b.size - a.size)) {
  console.log(`  ${String(p.size).padStart(5)}  ${p.label}`);
}

// What only some routes carry.
const base = rows.reduce((a, b) => (b.total < a.total ? b : a), rows[0]);
console.log(`\nlightest route: ${base.route}, ${base.total} bytes. Per-route additions above it:`);
for (const r of rows) {
  if (r.total === base.total) continue;
  const extras = r.parts.filter((p) => !base.parts.some((q) => q.label === p.label));
  if (!extras.length) continue;
  console.log(`  ${r.route.padEnd(30)} +${String(r.total - base.total).padStart(5)}  ${extras.map((e) => `${e.label} ${e.size}`).join(', ')}`);
}

process.exit(worst.total > CEILING ? 1 : 0);
