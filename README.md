# kishan-portfolio

Kishan Prajapati's personal site. Case studies on retrieval and NLP systems, published papers, teaching, and a page of engineering notes about measurements that turned out to be wrong.

Static site, no client framework. The only JavaScript that ships is the theme toggle and the mobile nav.

## Running it locally

Node 22.12 or newer.

```
npm install
npm run dev            # local dev server on port 4321
npm run build          # production build into ./dist
npm run preview        # serve the built output
npx astro check        # type and content collection errors
```

Both `npx astro check` and `npm run build` must be clean before any phase is called done.

The dev server can run detached with `astro dev --background`, managed with `astro dev status`, `astro dev logs`, and `astro dev stop`. Do not run the dev server and a production build at the same time.

## Where things live

| path | what is in it |
|---|---|
| `docs/CONTENT.md` | Every word and number that appears on the site |
| `docs/SPEC.md` | Stack, routes, build phases, acceptance criteria |
| `docs/DESIGN.md` | Colour tokens, type scale, component specifications |
| `docs/DECISIONS.md` | Decision record, one entry per call made |
| `docs/IMAGE-PROMPTS.md` | Prompts and processing steps for site imagery |
| `src/pages/` | Routes |
| `src/content/work/` | Case studies, as content collection entries |
| `src/components/` | Shared components |
| `src/layouts/` | Page layouts |
| `src/styles/global.css` | Colour tokens, type scale, base styles |

## The rule

No fact ships unless it is in `docs/CONTENT.md`. Not a number, not a date, not a job title, not a percentage, not a link. If a sentence needs a detail that is not in that file, rewrite the sentence or go find the source.

Every performance number on the site carries the conditions it was measured under: sample count, warmup, cache state, hardware, corpus size. Numbers keep the precision they were recorded with. Where something was not measured, the site says so and says why.
