// Rewrites every off-site link in the built HTML to open in a new tab,
// safely and audibly.
//
//   target="_blank"                 opens in a new tab
//   rel="noopener noreferrer"       not optional. Without noopener the opened
//                                   page gets a live window.opener handle back
//                                   into this one and can navigate it.
//   a visually hidden suffix        a new tab that opens unannounced is
//                                   disorienting for a screen reader user, who
//                                   gets no back button and no explanation.
//
// This runs at astro:build:done, over the emitted HTML, rather than through a
// component every link has to remember to use. That is the point: it covers
// markdown content, which never passes through an Astro component at all, and
// any link added later inherits the behaviour without anyone knowing it exists.
//
// Internal links, in-page anchors, mailto, tel and the resume PDF are all left
// alone: they stay in the same tab.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const SUFFIX = '<span class="sr-only"> (opens in new tab)</span>';

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function isExternal(href, siteHost) {
  if (!/^https?:\/\//i.test(href)) return false;
  try {
    return new URL(href).host !== siteHost;
  } catch {
    return false;
  }
}

function addRel(attrs) {
  const existing = attrs.match(/\srel\s*=\s*("([^"]*)"|'([^']*)')/i);
  const wanted = ['noopener', 'noreferrer'];
  if (!existing) return `${attrs} rel="${wanted.join(' ')}"`;
  const current = (existing[2] ?? existing[3] ?? '').split(/\s+/).filter(Boolean);
  for (const token of wanted) if (!current.includes(token)) current.push(token);
  return attrs.replace(existing[0], ` rel="${current.join(' ')}"`);
}

export default function externalLinks() {
  // Captured from the resolved config so "external" means "not this site"
  // rather than a hardcoded host that goes stale the next time the domain
  // changes.
  let siteHost = '';

  return {
    name: 'external-links',
    hooks: {
      'astro:config:done': ({ config }) => {
        siteHost = config.site ? new URL(config.site).host : '';
      },
      'astro:build:done': async ({ dir, logger }) => {
        const root = dir.pathname ? decodeURIComponent(dir.pathname) : String(dir);
        let rewritten = 0;
        let files = 0;
        for (const file of await htmlFiles(root)) {
          const html = await readFile(file, 'utf8');
          let touched = false;

          // Anchors cannot nest, so a non-greedy match to the next </a> is
          // exactly one link.
          const next = html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (whole, attrs, inner) => {
            const href = attrs.match(/\shref\s*=\s*("([^"]*)"|'([^']*)')/i);
            const url = href?.[2] ?? href?.[3] ?? '';
            if (!isExternal(url, siteHost)) return whole;
            // Leave anything that already states its own target.
            if (/\starget\s*=/i.test(attrs)) return whole;
            touched = true;
            rewritten += 1;
            return `<a${addRel(attrs)} target="_blank">${inner}${SUFFIX}</a>`;
          });

          if (touched) {
            files += 1;
            await writeFile(file, next);
          }
        }
        logger.info(`${rewritten} external links across ${files} pages open in a new tab`);
      },
    },
  };
}
