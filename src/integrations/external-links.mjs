// Runs over the built HTML at astro:build:done, so links written in markdown are covered too.
// noopener is not optional: without it the new tab can navigate this one.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const SUFFIX = '<span class="sr-only"> (opens in new tab)</span>';

// Same-site files that also open in a new tab.
const NEW_TAB_PATHS = new Set(['/kishan-prajapati-resume.pdf']);

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

function addRel(attrs, wanted) {
  const existing = attrs.match(/\srel\s*=\s*("([^"]*)"|'([^']*)')/i);
  if (!existing) return `${attrs} rel="${wanted.join(' ')}"`;
  const current = (existing[2] ?? existing[3] ?? '').split(/\s+/).filter(Boolean);
  for (const token of wanted) if (!current.includes(token)) current.push(token);
  return attrs.replace(existing[0], ` rel="${current.join(' ')}"`);
}

export default function externalLinks() {
  // From the resolved config, so a domain change needs no edit here.
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

          // Anchors cannot nest, so a non-greedy match to the next </a> is exactly one link.
          const next = html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (whole, attrs, inner) => {
            const href = attrs.match(/\shref\s*=\s*("([^"]*)"|'([^']*)')/i);
            const url = href?.[2] ?? href?.[3] ?? '';
            const external = isExternal(url, siteHost);
            if (!external && !NEW_TAB_PATHS.has(url)) return whole;
            // Leave anything that already states its own target.
            if (/\starget\s*=/i.test(attrs)) return whole;
            touched = true;
            rewritten += 1;
            const rel = external ? ['noopener', 'noreferrer'] : ['noopener'];
            return `<a${addRel(attrs, rel)} target="_blank">${inner}${SUFFIX}</a>`;
          });

          if (touched) {
            files += 1;
            await writeFile(file, next);
          }
        }
        logger.info(`${rewritten} links across ${files} pages open in a new tab`);
      },
    },
  };
}
