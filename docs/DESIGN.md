# DESIGN.md

The visual direction is decided. Do not redesign it. Implement exactly what is below, and if something is genuinely impossible, say so and ask rather than substituting.

---

## 0. THE THREE LOOKS THAT ARE FORBIDDEN

AI-generated web design currently clusters into three recognisable defaults. All three are banned on this project, because they are the visual equivalent of a resume that says "passionate self-starter".

1. **Banned:** warm cream background near `#F4F1EA` with a high-contrast serif display face and a terracotta or warm-clay accent near `#D97757`. This is the single most common tell.
2. **Banned:** near-black background with one bright acid-green or vermilion accent.
3. **Banned:** broadsheet pastiche. Dense newspaper columns, zero border radius everywhere, hairline rules used as the only structural device.

If any part of your implementation drifts toward one of these, stop and re-read this file. The direction below deliberately sits away from all three: the paper is cool and green-shifted rather than warm, the display face is monospace rather than serif, and the structural device carries meaning rather than decorating.

---

## 1. THE IDEA

The subject is a person whose defining habit is refusing to state a number without the conditions it was measured under, and whose benchmark harness returns `null` with a reason rather than a plausible fake.

So the site is built from **engineering graph paper**. A faint plotted grid, ink-on-paper contrast, measurements drawn as real error bars, and a `null` state that is designed rather than broken. The visual world is hand-plotted measurement, not dashboards and not SaaS.

**The one aesthetic risk, and it is deliberate:** the display typeface is a monospace, set large. Monospace at 64px as a display face is unusual and slightly stubborn. It is justified because every artifact in this person's work is a fixed-width column of numbers.

**The signature element** is the measurement block, specified in section 5. It appears on every page, it renders its own provenance, and it has a first-class `unmeasured` state. That component is the whole thesis of the site compressed into one piece of UI. Spend the design budget there and keep everything around it quiet.

---

## 2. COLOR TOKENS

Define these in `src/styles/global.css` inside a Tailwind 4 `@theme` block. Contrast ratios against the paper background are given because they were checked. Do not adjust any value for aesthetic reasons: several of them are sitting just above the WCAG AA threshold and small edits will push them under.

### Light, the default
```css
--color-paper:     #F6F8F6;  /* cool, faintly green-shifted white. NOT cream. */
--color-paper-2:   #ECF0EE;  /* recessed panels, table header rows */
--color-grid:      #D3DFD9;  /* graph rule */
--color-ink:       #16201C;  /* body and headings. 15:1 */
--color-ink-2:     #57635D;  /* secondary prose. 6.3:1 */
--color-ink-3:     #656F6A;  /* provenance captions. 4.9:1, do not lighten */
--color-null:      #A9B4AE;  /* the unmeasured state. Decorative glyphs only. */
--color-plot:      #1B4D42;  /* links, operating point marker, primary accent. 9.1:1 */
--color-plot-soft: #E2EDE8;  /* accent wash behind active nav, quoted blocks */
--color-annot:     #8A6A1F;  /* ochre. Caveats and limitations only. 4.8:1 */
--color-withdrawn: #A63A2E;  /* withdrawn or thrown-out measurements only. 6.2:1 */
```

### Dark
```css
--color-paper:     #0E1412;
--color-paper-2:   #161E1B;
--color-grid:      #1F2A26;
--color-ink:       #E3E9E5;
--color-ink-2:     #9AA6A0;
--color-ink-3:     #7C8882;
--color-null:      #4C5651;
--color-plot:      #5FBFA6;
--color-plot-soft: #16302A;
--color-annot:     #C9A227;
--color-withdrawn: #E0796C;
```

### Rules
- `--color-annot` is only ever used for caveats and limitations. Never for a link, never for a button, never decoratively.
- `--color-withdrawn` is only ever used on the notes page and on withdrawn measurement values. If it appears anywhere else, that is a bug.
- There is no fourth accent. Do not add one.
- No gradients anywhere. No shadows except a single 1px hairline used as a border. No glassmorphism, no blur, no glow.

---

## 3. TYPOGRAPHY

Two faces from one superfamily, three roles. Self-host both through Fontsource. Do not load fonts from Google's CDN.

```
npm install @fontsource-variable/ibm-plex-mono @fontsource-variable/ibm-plex-sans
```

If a variable build of either is unavailable, install the static `@fontsource/*` package and load only the weights listed below. Never load more than four font files total.

| role | face | weight | notes |
|---|---|---|---|
| display | IBM Plex Mono | 500 | headings, the numbers in measurement blocks |
| body | IBM Plex Sans | 400, 600 | all prose |
| data and labels | IBM Plex Mono | 400, 500 | tables, provenance lines, eyebrow labels, nav |

### Scale
```css
--text-display-xl: clamp(2.5rem, 6vw, 4rem);      /* Plex Mono 500, tracking -0.03em, leading 1.02 */
--text-display-l:  clamp(1.75rem, 3.5vw, 2.5rem); /* Plex Mono 500, tracking -0.02em, leading 1.1 */
--text-h2:         1.375rem;                       /* Plex Mono 500, tracking -0.01em */
--text-h3:         1.0625rem;                      /* Plex Sans 600 */
--text-body:       1.0625rem;                      /* Plex Sans 400, leading 1.65 */
--text-small:      0.875rem;                       /* Plex Sans 400 */
--text-label:      0.6875rem;                      /* Plex Mono 500, uppercase, tracking 0.11em */
--text-data:       1rem;                           /* Plex Mono 400 */
--text-data-big:   clamp(2rem, 4.5vw, 3.25rem);    /* Plex Mono 500, tracking -0.02em */
```

### Rules
- Every numeral anywhere on the site sits in Plex Mono with `font-variant-numeric: tabular-nums`. Numbers in prose too. This is what makes the site feel like his work.
- Prose measure is capped at `68ch`. Tables and plots are allowed to exceed it.
- Headings are sentence case. No Title Case, ever.
- No text-transform other than the `uppercase` on the `label` role.
- Do not use italic for emphasis on this site. Use the `label` role or `--color-ink-2` instead.

---

## 4. LAYOUT AND THE GRID BACKGROUND

### Container
Max width `1180px`. Gutters `24px` under 768px, `40px` above.

### The graph paper background
This is the atmosphere of the whole site and it must be CSS only, no image files.

```css
body {
  background-color: var(--color-paper);
  background-image:
    linear-gradient(to right, color-mix(in oklab, var(--color-grid) 55%, var(--color-paper)) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklab, var(--color-grid) 55%, var(--color-paper)) 1px, transparent 1px);
  background-size: 48px 48px;
  background-position: -1px -1px;
}
@media (max-width: 640px) {
  body { background-image: none; }
}
```

Major grid only at 48px. Do not add a minor grid, it becomes noise. Hidden on small screens. In dark mode the same rule applies with the dark `--color-grid`, and it should be barely perceptible.

### Page structures
- **Home:** single column, left aligned, asymmetric. The headshot is a `140px` square with a 1px `--color-ink` border, offset to the right of the lede on screens above 900px and placed above the H1 on mobile. It is not a circle. It is not 300px. It is not centered.
- **Case study pages (`/work/[slug]`):** two columns above 1024px. A `200px` sticky left rail holding the section index plus a small persistent "measured on" note giving the hardware. Main column `640` to `680px`. Below 1024px it collapses to one column with the section index rendered as a collapsed details element at the top.
- **Tables:** allowed to break the prose measure. Give them a `.bleed` utility that expands to the full container width. Below 720px they scroll horizontally inside a wrapper with `overflow-x: auto` and a visible scroll affordance. Never let a table silently clip.
- **Border radius:** `3px` on cards and panels, `2px` on inputs and buttons. Small but present. Not zero, because zero everywhere is one of the banned looks.

### The shell, D-054

The site is built on a two-column shell measured off the reference recorded in
`ref/ANALYSIS.md`. This supersedes the single-column page structures described
below.

```
|-- 150 --|-- 344 sticky --|-- 100 gap --|-- 696 content --|-- 150 --|
```

- Field is `1140px`, centred. The sticky column is `344px` and sticks at
  `top: 40px`. The content column is `696px` and every heading in it shares one
  hard left edge.
- Below `1024px` it collapses to one column, the sticky column becomes static
  and moves to the top, and display headings centre. Gutters are `20px`.
- The sticky column holds `ProfileCard` on standard pages and the section index
  plus the "measured on" note on case studies.

### Display type, D-054

Two-tone headings: a solid line over a ghosted line at 18 percent.

| role | size | weight | tracking | leading |
|---|---|---|---|---|
| `.display` (h1) | `clamp(3.25rem, 7.6vw, 6.875rem)` | 600 | **0** | 1.0 |
| `.section-h` (h2) | `clamp(2.625rem, 6.25vw, 5.625rem)` | 600 | **0** | 1.0 |
| `.stat-value` | `clamp(2.5rem, 4.9vw, 4.375rem)` | 600 | `-0.01em` | 1.2 |
| `.stat-label` | `1rem` | 400 | `-0.01em` | 1.2, uppercase |

Tracking on the two display sizes is **zero**, and this is measured, not
guessed. The reference has no wide tracking anywhere on it; its only non-zero
tracking is negative, on the stat figures and the profile name. Uppercasing is
done with `text-transform` so the DOM text stays sentence case.

Plex Mono 600 is loaded for these roles. With Plex Sans variable and Plex Mono
400 and 500 that is exactly four font files for a latin reader, which is the
ceiling in section 3.

### Background, D-053

The graph paper background is removed. It fought the flat, card-based layout
and the reference field is a single unbroken surface. Restoring it is one rule
in `global.css`.

### Containers, `<Card>`

Per D-045 the site is built from containers rather than one continuous scroll. This supersedes any part of this section that assumed a single flowing column.

- 1px `--color-grid` border, `3px` radius, `--color-paper` background so the card reads as sitting on the graph paper, `24px` internal padding, `20px` gap between cards.
- On `:hover` and `:focus-within` the border becomes `--color-plot` over `120ms`. That is the entire interaction. No shadow, no lift, no scale, no background change.
- **Never put a card inside a card.** A `Measurement`, a `Caveat`, a table or a chip row inside a card is fine, because none of them is a card.

**Project card contents, top to bottom:** a 16:9 image slot at full card width using the empty-slot treatment when no PNG exists, the title at `--text-h2`, a one-line summary, a row of chips, one `Measurement` block carrying the most striking number for that project, and a "read the case study" link.

**Chips:** label role, 1px `--color-grid` border, `2px` radius, `4px` by `8px` padding. Status first, then up to four stack items.

**Where cards apply:** `/work` (Sieve and Gatekeepn't as full-width feature cards, the other three in a two-column grid above 900px, the four front-end repos staying a compact list), the home page (featured work as two cards, each measurement block in a card, the secondary facts row as one wide card), `/papers` (one card per paper), `/teaching` (one small card per appointment in a three-up grid, one card per named section), `/about` (education, work history, certifications), and the seven tables in the Sieve case study, each wrapped with its title in the label role at the top.

**Where cards do not apply:** `/notes` stays flowing prose and tables, because that page is meant to be read straight through and boxing it would hurt it. The Sieve case study body also stays flowing; only its tables are wrapped.

The error-bar divider still separates major sections on every page.

### The section divider
Do not use a plain `<hr>`. The divider is an error-bar bracket, because that encodes a bounded interval, which is what this site is about. Implement it as an inline SVG or a CSS pseudo-element construction:

```
├──────────────────────────────────────────────────┤
```

A 1px horizontal rule in `--color-grid` spanning the container, with 1px vertical end caps `8px` tall at both ends, in `--color-grid`. Nothing else. Used between major page sections.

---

## 5. THE SIGNATURE COMPONENT: `<Measurement>`

This is the one thing the site is remembered by. Build it carefully.

### Props
```ts
interface MeasurementProps {
  label: string;                    // "end-to-end retrieval speedup"
  value?: string;                   // "6.3", omit for unmeasured
  unit?: string;                    // "x", "ms", "%"
  range?: [number, number];         // draws the bar span
  ci?: string;                      // "±0.0011"
  provenance?: string;              // see the state contract below
  state: 'measured' | 'unmeasured' | 'withdrawn';
  reason?: string;                  // see the state contract below
  href?: string;                    // optional link on the whole block
}
```

### The state contract

| state | provenance | reason |
|---|---|---|
| `measured` | required | forbidden |
| `unmeasured` | forbidden | required |
| `withdrawn` | optional | required |

Enforce in the component: throw at build time on every violation of this table, including `provenance` supplied on an `unmeasured` block. Nothing was measured in that state, so there are no conditions to state, and `reason` carries it. A measured value without provenance must be impossible to render on this site, and so must an unmeasured block that claims provenance. That constraint is the point.

### `measured` rendering, top to bottom
1. `label`, in the label role, `--color-ink-3`.
2. The value in `--text-data-big`, `--color-ink`, tabular nums. The unit follows at `0.45em`, baseline-aligned, in `--color-ink-2`. If `ci` is present it follows the unit in `--text-data` at `--color-ink-2`.
3. **The error bar.** An inline SVG, `100%` width by `14px` height:
   - a 1px horizontal rule in `--color-ink-3` spanning the mapped `range`
   - 1px vertical end caps `8px` tall at each end of that range
   - a 2px vertical tick `12px` tall in `--color-plot` at the point estimate
   - if `range` is absent, render only the tick and no bar
   - `role="img"` with an `aria-label` restating the value and range in words
4. `provenance`, Plex Mono 400 at `0.875rem`, `letter-spacing: 0`, `line-height: 1.5`, `--color-ink-3`, not uppercased, wrapping freely, full width. Per D-022 this is deliberately **not** the label role. Provenance runs to several sentences and the label role's 0.11em tracking at 11px is not readable at that length.

### `unmeasured` rendering
This state must look deliberate, not broken. A visitor should be able to tell in one second that the absence is on purpose.
1. `label` as above.
2. In the value slot: an opening bracket, a 1px dotted horizontal rule filling the space, and a closing bracket, all in `--color-null`, at the same height the number would have occupied. Then the word `null` in `--text-data`, `--color-null`.
3. No error bar. Leave the 14px of vertical space empty so blocks stay aligned in a row.
4. `reason` in `--color-annot`, `--text-small`, prefixed by the label-role word `NOT MEASURED`.

### `withdrawn` rendering
1. `label` as above.
2. Value rendered as normal but with a 1px horizontal rule struck through it in `--color-withdrawn`, drawn as a pseudo-element, not the `<s>` element, so the number stays readable.
3. `reason` in `--color-withdrawn`, `--text-small`, prefixed by the label-role word `WITHDRAWN`.
4. If `provenance` is present, it renders after the reason, exactly as in the measured state.

### Layout in groups
On the home page, three blocks sit in a row above 900px and stack below. They share a baseline: the value line of all three must align. Use CSS grid with explicit rows, not flexbox with guessed padding.

---

## 6. SECOND COMPONENT: `<Caveat>`

Used roughly eight times across the site. It is not a warning box and must not look like one.

- A 2px left border in `--color-annot`. No background fill, no icon, no rounded corners.
- `16px` left padding, `--color-ink-2` body text at `--text-small`.
- The word `CAVEAT` in the label role, `--color-annot`, on its own line above the body.

---

## 7. MOTION

Supersedes the previous version of this section, which said two animations
existed and that was the complete list. It is now a system, described below.

### Two clocks

Motion runs on two different clocks and the distinction is the whole design.

**Time-based, for the hero.** Elements already on screen at load have no entry
to scroll through, so a scroll timeline would leave them stuck part way or
invisible. The nav, sidebar, portrait, `h1`, lede, stats and capability cards
all animate on a time clock at load. Only content below the first viewport uses
a scroll timeline.

**Scroll-based, for everything else.** `animation-timeline: view()`. No
IntersectionObserver, no library, no added client JavaScript.

```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  animation: reveal-up linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 45%;
}
@keyframes reveal-up { to { opacity: 1; transform: none; } }
```

### Five rules that are not negotiable

1. `animation-fill-mode: both`, always. Without it the element resets when
   scrolled back up.
2. Never set `animation-duration` on a scroll timeline. It is ignored. Scroll
   position is the clock. This is also why **stagger on a scroll timeline is an
   `animation-range` offset, not a delay**: there is no time axis to delay
   along. Siblings step 5 percent of entry apart, five deep, then the cycle
   resets.
3. Animate only `opacity`, `transform` and `clip-path`. Never `width`,
   `height`, `margin`, `top` or `padding`. Use `scaleX` and translate instead.
4. No `will-change` anywhere. The browser promotes layers itself and
   preemptive hints waste memory, which matters on 8 GB.
5. Every scroll-driven rule sits inside
   `@supports (animation-timeline: view())`. Support is roughly 84 to 90
   percent. The hidden start state lives **inside** the guard, so in the
   fallback elements are simply visible and static. There is no state in which
   an unsupported browser gets invisible content.

Do not use `animation-trigger`. Chrome and Edge only as of mid 2026.

### The build trap that cost an hour

Lightning CSS folds `animation-timeline` into the `animation` shorthand,
emitting `animation: linear both reveal-up view()`. That is valid CSS
Animations Level 2 and **no browser implements it**, so the whole declaration is
dropped, `animation-name` computes to `none`, and every reveal stays frozen in
its start state. It fails silently and only at build, never in dev.

`astro.config.mjs` therefore pins `vite.build.cssMinify: 'esbuild'`. If reveals
ever go blank again, check the compiled CSS for `view()` inside the `animation`
shorthand before checking anything else.

### The two gotchas

**Above the fold.** Covered by the time clock above. Never put `.reveal` on
anything in the first viewport.

**Last screen.** An element near the bottom of a short page can never complete
an entry range, because the page cannot scroll far enough. The final section on
every page uses `animation-range: entry 0% cover 40%`. Selector precision
matters: `main > :last-child` matches the shell wrapper and silently applies the
last-screen range to the entire page, so the rule targets
`.section:last-of-type` and `.shell-main > :last-child`. Verified on `/404` and
`/work/moodlens`, the two shortest pages.

### Tokens

```css
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);
--dur-micro: 160ms;
--dur-fast:  240ms;
--dur-base:  420ms;
--dur-slow:  700ms;
--dur-hero:  900ms;
```

Text moves 16px, cards move 24px, nothing moves more than 32px. Long travel
reads as cheap and feels laggy. Stagger siblings 70ms apart on the time clock,
maximum five in a chain, then reset.

### Page load sequence

| at | element | motion |
|---|---|---|
| 0ms | nav | fade only, no movement |
| 0ms | sidebar card | fade and 16px rise, `--dur-slow`, `--ease-out-expo` |
| 120ms | portrait | `clip-path` wipe from `inset(0 0 100% 0)`, `--dur-slow` |
| 200ms | `h1` | per-line mask reveal, 80ms between lines, `--dur-slow` |
| 420ms | lede | fade and 16px rise, `--dur-base` |
| 520ms | three stats | 70ms stagger, fade and 16px rise |
| 560ms | stat figures | `clip-path` wipe from the bottom |
| 680ms | capability cards | 70ms stagger |

The portrait uses `clip-path` rather than `width` so the reveal is independent
of the image dimensions and stays on the compositor.

**The figures do not count up.** Counting needs JavaScript, screen readers read
the intermediate values, and it is a cliche. They wipe instead.

### Scroll reveals, per element

| element | motion | range |
|---|---|---|
| section heading | per-line mask reveal | `entry 10% entry 50%` |
| eyebrow label | fade only | `entry 0% entry 30%` |
| cards in a grid | fade, 24px rise, scale 0.98 to 1 | staggered, own `view()` timeline each |
| list rows | same as cards | staggered |
| tables | fade only, no movement | `entry 0% entry 40%` |
| case study prose | **none** | |
| notes page body | **none**, headings only | |

Each grid item gets its own `view()` timeline rather than one shared timeline,
so a card entering alone still animates. Tables never move: a table sliding
while someone is reading a number is irritating. Case study prose and the notes
body get no reveal at all, because paragraph-by-paragraph fade-in on a page
someone is actually reading is hostile.

### Scroll progress

A 2px bar fixed to the top of the viewport in `--color-plot`, `scaleX` 0 to 1
on `animation-timeline: scroll(root block)`. One rule, no JavaScript,
`aria-hidden`.

### Micro-interactions

Cards: border to `--color-plot` over `--dur-fast` plus `translateY(-2px)`. No
shadow, no scale, no lift beyond 2px. Links: 1px to 2px underline over
`--dur-micro`. Buttons: background fill over `--dur-fast`, and `scale(0.98)` on
`:active` over `--dur-micro` so a click feels physical. Social icons:
`--color-ink-2` to `--color-plot` over `--dur-micro`.

**Every hover state also fires on `:focus-visible`.** A keyboard user gets the
same feedback.

### Page transitions

`<ClientRouter fallback="animate" />` in `Base.astro`, fade at 240ms, not
slide. Slide on a five-page portfolio reads as a gimmick.

Three things it breaks, all handled:

1. **Scripts do not re-run after client-side navigation.** The theme toggle,
   the mobile nav and the case study rail all rebind on `astro:page-load`,
   which fires on the initial load and on every navigation, guarded by a
   `data-bound` flag so a persisted node is not double-bound.
2. **The theme class can flash**, because the router swaps `<html>` attributes.
   The inline pre-paint script stays, and a second inline listener reapplies
   the class on `astro:after-swap`, in the same frame as the swap.
3. **The sidebar carries `transition:persist`** so it does not replay its entry
   animation on every navigation. Only the profile branch persists; the case
   study rail differs per page and must not be carried over.

### Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    animation-timeline: auto !important;
  }
  .reveal, [class*="reveal"] { opacity: 1 !important; transform: none !important; clip-path: none !important; }
}
```

`animation-timeline: auto` is the part people forget. Without it a
reduced-motion user can be left with an element frozen in its scroll-driven
start state, which means invisible. The reset list also names every element
that carries a hidden start state, not just `.reveal`.

Text is present in the DOM and readable at all times, never `opacity: 0` with
no fallback. Mask reveals keep the text in flow, which is why they are
preferred over anything that removes it. Nothing animates on the focus ring
itself. Nothing flashes more than three times per second.

## 8. THE HERO PLOT

Hand-authored inline SVG. No charting library. Data is in CONTENT.md section 2.

- X axis: `ef_search`, four labelled ticks at 200, 400, 600, 800.
- Y axis: `recall@200`, ranged `0.93` to `1.00` so the curve's shape is visible. Label the axis with the actual range so nobody reads it as starting at zero. Add the note `y axis starts at 0.93` in the label role next to the axis.
- The curve: 1.5px stroke in `--color-plot`, four visible 3px point markers.
- Error bars: a 1px vertical bar at each point spanning plus and minus the stdev, in `--color-ink-3`. These are tiny at this scale. Draw them anyway. They are the point.
- Operating point at ef=600: a 7px hollow circle, 1.5px stroke `--color-plot`, plus a horizontal leader line to a label reading `production: ef 600, N 200` in the label role.
- Plot area sits on the graph-paper grid with no card, no border, no fill.
- `role="img"` plus an `aria-label` describing the trend and the operating point in a sentence. Also render the four data points as a visually hidden table so a screen reader gets the actual numbers.
- The caption from CONTENT.md section 2 goes directly beneath, at `--text-small`, `--color-ink-3`, including the sentence about the 500 corpus-title queries. That sentence stays. It is the most important sentence on the page.

---

## 9. QUALITY FLOOR

Not optional, and not something to announce in the UI.

- Responsive from `320px` up. Test at 320, 375, 768, 1024, 1440.
- Visible keyboard focus on every interactive element: `2px` outline in `--color-plot` with `2px` offset. Never `outline: none`.
- A skip-to-content link, visually hidden until focused.
- Semantic heading order with no skipped levels. One `h1` per page.
- All images have real alt text describing content, not filenames. The headshot alt is `Kishan Prajapati`.
- Dark mode via a `class` on `html`, toggled by a button, persisted, defaulting to the system preference. Set the class before first paint with a tiny inline script in `<head>` so there is no flash.
- Colour is never the only carrier of meaning. The `unmeasured` state also says the word `null`, and the `withdrawn` state also says the word `WITHDRAWN`.
- Lighthouse targets on the deployed build: 100 accessibility, 100 best practices, 100 SEO, performance 95 or above on mobile.
- Total client-side JavaScript under 10 KB gzipped. The only JS on the site is the theme toggle and the mobile nav. If a bundle analysis shows a framework runtime shipping, that is a bug.
