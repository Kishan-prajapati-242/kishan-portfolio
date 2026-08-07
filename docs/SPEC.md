# SPEC.md

Build specification. Read CLAUDE.md, CONTENT.md and DESIGN.md before starting.

---

## 1. STACK, DECIDED

| layer | choice | why |
|---|---|---|
| framework | Astro 7 | Static output, zero client JS by default, content collections with schema validation, first-class image optimisation. Suits a content site on an 8 GB machine better than Next.js. |
| styling | Tailwind CSS 4 via `@tailwindcss/vite` | CSS-first `@theme` config maps directly onto the token system in DESIGN.md. |
| content | Astro content collections, Markdown and MDX | Case studies as content files with a Zod schema, so a missing `provenance` field fails the build. |
| fonts | Fontsource, self-hosted | No third-party CDN request, no layout shift. |
| images | `astro:assets` | Generates WebP and AVIF, sets width and height, lazy loads. Feed it the source PNG and let it work. |
| host | Vercel, Hobby tier | Free, non-commercial, auto-deploys on push to `main`, no config file needed, no build YAML to debug. |
| CI | GitHub Actions | Runs `astro check` and `astro build` on every push. Catches a broken build before Vercel does. |

Do not add: React, Vue, Svelte, a component library, a CMS, an animation library, an icon package, analytics, a cookie banner, a newsletter form, a contact form, a chatbot.

`@astrojs/tailwind` is deprecated for Tailwind 4. Use `npx astro add tailwind`, which wires `@tailwindcss/vite` into `vite.plugins`. If you see instructions telling you to add `tailwind()` to the `integrations` array, they are for Tailwind 3 and they are wrong here.

### Astro 7 specifics, verified August 2026

This project is on Astro 7.1.6, which shipped in June 2026. A lot of Astro material online still describes Astro 4 or 5. Where they disagree with this section, this section wins. Check `npx astro --version` rather than assuming.

- **The compiler was rewritten in Rust and is stricter about HTML.** It no longer silently corrects invalid nesting. A `<div>` inside a `<p>` used to be quietly restructured and now the browser closes the `<p>` early and your layout breaks. Write valid nesting the first time. If rendered output looks wrong after a change, check nesting before checking CSS.
- **Content collections use the Content Layer API.** Config lives at `src/content.config.ts`, collections take a `loader`, `type: 'content'` no longer exists, and entries are keyed by `id` rather than `slug`. Section 4 has the exact shape. Backward-compatibility shims for the old style exist, but do not use them.
- **Sätteri is the default Markdown processor**, replacing remark and rehype. This project uses no remark or rehype plugins, so nothing is needed. If a future requirement needs one, `@astrojs/markdown-remark` has to be installed explicitly to restore the unified pipeline. Do not add it speculatively.
- **Vite 8 with the Rolldown bundler.** The Vite plugin API is unchanged, so `@tailwindcss/vite` works normally.
- If `npm install` throws `ERESOLVE` on a peer dependency, do not reach for `--force` or `--legacy-peer-deps`. Report the exact error to Kishan first.

---

## 2. ROUTES

| route | source | notes |
|---|---|---|
| `/` | `src/pages/index.astro` | Hero plot, three measurement blocks, secondary facts, featured work, footer |
| `/work` | `src/pages/work/index.astro` | Index of everything, with the four front-end repos in a compact group at the bottom |
| `/work/sieve` | content collection | Full case study. The longest page on the site. |
| `/work/gatekeepnt` | content collection | Variant A only. See CONTENT.md section 4. |
| `/work/atctm` | content collection | Short. Must carry the status correction. |
| `/work/moodlens` | content collection | Short. Prominent live-demo link. |
| `/work/moodinsight` | content collection | Short. Uses the published 88.10 figure only. |
| `/papers` | `src/pages/papers.astro` | Four entries, newest first, real DOI links |
| `/teaching` | `src/pages/teaching.astro` | Appointments table, grading philosophy, GDSC |
| `/notes` | `src/pages/notes.astro` | The incident log. Long. |
| `/about` | `src/pages/about.astro` | Bio, education, work authorization line, interests |
| `/404` | `src/pages/404.astro` | See section 6 |
| `/kishan-prajapati-resume.pdf` | `public/` | Static file, placed by hand |

Nav, in this order: `Work`, `Papers`, `Teaching`, `Notes`, `About`. Five items, no dropdowns. On mobile collapses to a single toggle. The current page is marked with `aria-current="page"` and a `--color-plot-soft` background, not a bold weight change, so nothing reflows.

The resume is a plain link labelled `Resume (PDF)` in the footer and on `/about`. Do not build an HTML resume page. It will go stale.

---

## 3. FILE LAYOUT

```
.
├── .github/
│   └── workflows/
│       └── ci.yml
├── CLAUDE.md
├── docs/
│   ├── SPEC.md
│   ├── CONTENT.md
│   ├── DESIGN.md
│   ├── IMAGE-PROMPTS.md
│   └── DECISIONS.md
├── public/
│   ├── kishan-prajapati-resume.pdf
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── og-default.png
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── headshot.png
│   │   └── work/            # project card art
│   ├── components/
│   │   ├── Measurement.astro
│   │   ├── Caveat.astro
│   │   ├── Divider.astro
│   │   ├── DataTable.astro
│   │   ├── RecallPlot.astro
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── ThemeToggle.astro
│   │   └── SEO.astro
│   ├── content.config.ts    # NOTE: src/content.config.ts, not src/content/config.ts
│   ├── content/
│   │   └── work/
│   │       ├── sieve.mdx
│   │       ├── gatekeepnt.mdx
│   │       ├── gatekeepnt-full.mdx      # draft: true
│   │       ├── atctm.mdx
│   │       ├── moodlens.mdx
│   │       └── moodinsight.mdx
│   ├── layouts/
│   │   ├── Base.astro
│   │   └── CaseStudy.astro
│   ├── pages/
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

---

## 4. CONTENT COLLECTION SCHEMA

In `src/content.config.ts`. Note the path: it is `src/content.config.ts`, **not** `src/content/config.ts`. The old location and the old `type: 'content'` property were replaced by the Content Layer API. Backward compatibility shims exist but do not rely on them, write it the current way.

The schema is a build-time guard, so make it strict.

```ts
import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/work' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    subtitle: z.string(),
    order: z.number(),                 // display order on /work
    timeline: z.string(),              // "July 2026, roughly 8 working days"
    team: z.string(),                  // "solo" | "4 authors"
    status: z.enum(['shipped', 'live', 'under review', 'ongoing', 'archived']),
    repo: z.string().url().optional(),
    repoPrivate: z.boolean().default(false),
    demo: z.string().url().optional(),
    stack: z.array(z.string()).min(1),
    cardArt: image().optional(),
    cardArtAlt: z.string().optional(),
    summary: z.string().max(240),      // used on /work and in meta description
    draft: z.boolean().default(false),
  }).refine(d => !d.cardArt || !!d.cardArtAlt, {
    message: 'cardArt requires cardArtAlt',
  }),
});

export const collections = { work };
```

Entries are addressed by `id`, not `slug`. `slug` was removed. In the dynamic route use `entry.id` for `getStaticPaths` params, and render with `const { Content } = await render(entry)` where `render` is imported from `astro:content`.

Filter `draft: true` out of every listing and out of the sitemap. `gatekeepnt-full.mdx` stays drafted until Kishan clears the publishing gate in CONTENT.md section 4.

---

## 5. BUILD PHASES AND ACCEPTANCE CRITERIA

Do these strictly in order. Do not start a phase until the previous one passes its criteria. Report to Kishan at each gate and wait.

### Phase 0: scaffold and tokens
Scaffold Astro with the minimal template and TypeScript strict. Add Tailwind, sitemap, MDX. Install Fontsource. Write `global.css` with every token from DESIGN.md section 2, the type scale from section 3, the graph-paper background from section 4, and the reduced-motion block from section 7. Build `Base.astro`, `Nav.astro`, `Footer.astro`, `ThemeToggle.astro`, `SEO.astro`, `Divider.astro`.

**Passes when:** `npm run build` succeeds. `npx astro check` reports zero errors. A placeholder home page renders with the grid visible, the theme toggle switches and persists with no flash on reload, the skip link works, and keyboard tab order through the nav is correct and visibly focused.

### Phase 1: the signature components
Build `Measurement.astro` to the full spec in DESIGN.md section 5, all three states, with the build-time throw when `provenance` or `reason` is missing. Build `Caveat.astro` and `DataTable.astro`.

**Passes when:** a scratch page renders all three measurement states side by side with value lines aligned on a shared baseline, the error bar geometry is correct at 320px and 1440px, removing `provenance` from a block fails the build with a clear message, and the `unmeasured` state reads as intentional rather than broken.

### Phase 2: home page
`RecallPlot.astro` with the real data, then the full home page from CONTENT.md section 2.

**Passes when:** the plot is correct, the y axis is labelled as starting at 0.93, error bars are drawn, the operating point is marked and labelled, the caption including the 500-corpus-title sentence is present, the curve draws once on load and renders complete under reduced motion, and the three measurement blocks are correct including the `null` block.

### Phase 3: work index and Sieve
The collection schema, `CaseStudy.astro` with the sticky rail, `/work`, and the full Sieve case study.

**Passes when:** every table is readable at 375px without clipping, the mandatory pre-dedup caveat sits immediately after the corpus table, both `unmeasured` blocks render, the sticky rail tracks the current section and collapses correctly below 1024px, and no number on the page is absent from CONTENT.md.

### Phase 4: remaining content
`/work/gatekeepnt` Variant A, the three short project pages, `/papers`, `/teaching`, `/notes`, `/about`, `/404`.

**Passes when:** every external link resolves with a 200, the ATCTM status correction is present verbatim, MoodInsight uses 88.10 and not 89 as its figure, `gatekeepnt-full.mdx` exists but is drafted and absent from all listings and the sitemap, and no student names appear anywhere in the repo.

### Phase 5: polish
Favicon, OG images, JSON-LD, sitemap, `robots.txt`, image optimisation, a11y audit, Lighthouse.

**Passes when:** Lighthouse on the production build hits the targets in DESIGN.md section 9, every page has a unique title and description, no page ships the home page's description, the OG image renders correctly in a preview tool, and total client JS is under 10 KB gzipped.

### Phase 6: deploy
GitHub repo, Vercel connection, verify live.

**Passes when:** the site is live on HTTPS, a push to `main` triggers a deploy that succeeds, and the live site passes the same Lighthouse targets as local.

---

## 6. THE 404 PAGE

Do not write "Oops!" or "Looks like you're lost". Use the site's own voice:

```
404

No page at this path. The request was well formed and the answer does not exist, which is a distinction I care about elsewhere on this site.

[Back to home]
```

---

## 7. THE FAVICON

Hand-author it as SVG. Do not generate it with an image model, which cannot produce crisp geometry at 32px.

A 32 by 32 viewBox. Four vertical bars of heights 18, 24, 27, 28 pixels, 3px wide, 4px apart, bottom-aligned on a shared baseline, in `--color-plot` (`#1B4D42`). That is the recall curve as a bar sparkline. Add a `prefers-color-scheme: dark` block inside the SVG switching the fill to `#5FBFA6`. Provide `favicon.svg` plus a 180px `apple-touch-icon.png` rendered from it.

---

## 8. GITHUB ACTIONS

One workflow, `.github/workflows/ci.yml`, on push and pull request to `main`:
1. checkout
2. setup Node 22 with npm cache
3. `npm ci`
4. `npx astro check`
5. `npm run build`

No deploy step. Vercel handles deployment through its own GitHub integration. Two deploy paths is how you get confused about which one is live.

---

## 9. THINGS THAT WOULD BE A BUG

- A number on the site that is not in CONTENT.md
- A performance claim without its timing window
- An em dash anywhere in any file, including comments and commit messages
- `localStorage` used for anything other than the theme preference
- A framework runtime in the client bundle
- The word "passionate", "leveraged", "spearheaded", "cutting-edge", "seamless", or "delve" in any user-facing string
- Citation counts on `/papers`
- A phone number, street address, date of birth, student ID, or student name anywhere in the repo, including git history
- The Gatekeepn't full results shipping before the publishing gate clears
- `outline: none` on any focusable element
- A table that clips instead of scrolling on mobile
- Any AI-generated image containing text, letters, or numbers
