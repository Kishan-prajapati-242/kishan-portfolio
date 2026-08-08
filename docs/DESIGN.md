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
--color-paper:     #EFF3F1;  /* page. L* 95.5 */
--color-raised:    #FCFDFC;  /* cards, panels, nav pill, anything lifted. L* 99.2 */
--color-paper-2:   #E1E8E4;  /* recessed: table header rows, chrome, code. L* 91.4 */
--color-grid:      #CFDCD6;  /* hairline */
--color-ink:       #16201C;  /* body and headings. 16.4:1 on raised */
--color-ink-2:     #57635D;  /* secondary prose. 6.2:1 on raised */
--color-ink-3:     #626C67;  /* provenance captions. 5.3:1 on raised */
--color-null:      #A9B4AE;  /* the unmeasured state. Decorative glyphs only. */
--color-plot:      #1B4D42;  /* links, operating point marker, primary accent. 9.1:1 */
--color-plot-soft: #E2EDE8;  /* accent wash behind active nav, quoted blocks */
--color-annot:     #816315;  /* ochre. Caveats and limitations only. 5.0:1 on page */
--color-withdrawn: #A63A2E;  /* withdrawn or thrown-out measurements only. 6.2:1 */
```

### Dark
```css
--color-paper:     #111815;  /* page. L* 7.5 */
--color-raised:    #1F2B26;  /* cards. L* 16.3 */
--color-paper-2:   #070B0A;  /* recessed. L* 2.8 */
--color-grid:      #33403B;
--color-ink:       #E3E9E5;
--color-ink-2:     #9AA6A0;
--color-ink-3:     #889490;
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
- No gradients on surfaces. No glassmorphism, no glow.
- `--color-ink-3` must not reduce contrast against any surface it sits on, and must stay clear of `--color-ink-2`. The two are a hierarchy: under about 3 L* apart they stop reading as different tiers. It currently sits 3.9 L* above ink-2 in light and 6.8 below in dark. This replaces the earlier wording, "do not lighten", which was a sloppy encoding of the intent: the direction never mattered, the contrast and the tier gap do.
- `--color-ink-3` never sits on `--color-paper-2`. That is why inline `code`, which is the one place it could be inherited onto the recessed surface, pins itself to `--color-ink`.

### Elevation

Three surface levels. Before this the page, every card and every container were the identical hex, separated only by a hairline, and the site read as one flat field. That got worse when the graph paper went, because cards lost the thing they used to sit against.

| level | job |
|---|---|
| `--color-paper-2` | cut into the page: table header rows, browser chrome bars, inline code, image placeholders |
| `--color-paper` | the page itself |
| `--color-raised` | sitting on the page: cards, data table panels, the profile sidebar, the nav pill, stat cells |

Steps, in CIE L\*, which is the axis that answers "can I see that these two large areas are different":

| | recessed to page | page to raised |
|---|---|---|
| light | 4.1 | 3.7 |
| dark | 4.7 | **8.8** |

**The asymmetry is deliberate.** Light has a soft shadow doing half the work of lifting a card off the page. Dark has none, because a soft shadow on a dark field is either invisible or a grey halo, so the whole job falls to the lightness step and the hairline. Dark also has the headroom to spend and light does not.

**Light cannot go further, and the reason is worth recording.** The ramp is boxed between near-white at the top and, at the bottom, the point where `--color-ink-3` stops passing AA. Every surface carrying ink-3 text must sit at L\* 92.9 or lighter, which leaves about 6.7 L\* of usable range for two steps. Pushing past that needs ink-3 to darken, and ink-3 cannot darken without merging into ink-2 and collapsing the two secondary tiers into one. The only remaining lever would be moving ink-2 as well, which is a bigger change than this one and has not been made.

**A shadow is now allowed on raised surfaces**, which reverses the earlier blanket ban. That ban made sense when the page carried a printed grid for cards to sit against. Without it the shadow does more work than a second border would. Very soft, two layers, tinted with the ink colour rather than pure black so it stays in the family, and light mode only:

```css
--shadow-raised: 0 1px 2px rgb(22 32 28 / 0.04), 0 6px 16px -6px rgb(22 32 28 / 0.10);
```

### Verifying contrast

`scripts/verify-contrast.mjs` walks every rendered text node on every route in both themes, resolves the background the browser actually paints by walking up through translucent ancestors, and reports the worst ratio that occurs. It measures pairs that exist rather than a matrix of every token against every surface: the matrix says ink-3 on recessed fails while the site never puts it there, and it says nothing about the pairs that arise through inheritance, which is where the real failures hide.

Two known failures, both predating the elevation work and both governed by decisions above this one, so neither was quietly changed:

- **The ghosted display line**, 1.50:1. Section 4 specifies the second line of the two-tone heading at 18 percent of ink. It is a real word in a real heading, so WCAG's incidental-text exemption does not obviously cover it. Unchanged by elevation: the ghost is mixed from the page colour, so the ratio moves with it.
- **The `unmeasured` state**, 1.91:1 light and 2.37:1 dark. `--color-null` is documented here as "decorative glyphs only" but renders the word `null` at 16px. Elevation moved these from 2.00 and 2.45, a change too small to matter against a shortfall of more than two ratio points, so the token was left alone rather than churned.

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

- 1px `--color-grid` border, `--radius-card` radius, `--color-raised` background and `--shadow-raised`, `24px` internal padding, `20px` gap between cards. The background was `--color-paper`, which made the card the same colour as the page it sat on; see the elevation subsection of section 2.
- Hover is a layered gesture, not a border change: see section 7. The single-property version described here was superseded by the hover system, and the no-shadow clause by elevation.
- **Never put a card inside a card.** A `Measurement`, a `Caveat`, a table or a chip row inside a card is fine, because none of them is a card.

**Project card contents, top to bottom:** a 16:9 image slot at full card width using the empty-slot treatment when no PNG exists, the title at `--text-h2`, a one-line summary, a row of chips, one `Measurement` block carrying the most striking number for that project, and a "read the case study" link.

**Chips:** label role, 1px `--color-grid` border, `2px` radius, `4px` by `8px` padding. Status first, then up to four stack items.

**Skill marks** are real Simple Icons paths, vendored into `src/data/icons.ts` by `scripts/fetch-icons.mjs` so the build makes no network request. Monochrome `currentColor`, `--color-ink-2` resting and `--color-plot` on hover and focus. Anything the set has no mark for renders as a text chip; a generic mark is never substituted. SQL is currently the only one.

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

**The mask is a scroll container.** `overflow: hidden` makes an element a
scroll container, and `view()` resolves against the **nearest** scroll
container, not the document. So a line mask built with `overflow: hidden` makes
its own inner span measure itself against the mask, which the span exactly
fills, so the timeline reads as complete from the first frame and every heading
reveals on load no matter how far down the page it is. There is no
`view(<scroller>)` syntax to reach for: `view()` takes only an axis and an
inset, and `view(root)` is invalid and silently falls back to
`animation-timeline: auto`. **The mask must use `clip-path: inset(0)`**, which
clips painting without creating a scroller.

**Last screen.** An element near the bottom of a short page can never complete
an entry range, because the page cannot scroll far enough. The final section on
every page uses `animation-range: entry 0% cover 40%`. Selector precision
matters: `main > :last-child` matches the shell wrapper and silently applies the
last-screen range to the entire page, so the rule targets
`.section:last-of-type` and `.shell-main > :last-child`. Verified on `/404` and
`/work/moodlens`, the two shortest pages.

### Tokens

```css
--ease-spring:    linear(0, 0.18, 0.42, 0.72, 0.95, 1.06, 1.04, 1.01, 0.99, 1);
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-quart:  cubic-bezier(0.5, 0, 0.75, 0);
--dur-micro: 200ms;
--dur-fast:  320ms;
--dur-base:  600ms;
--dur-slow:  1000ms;
--dur-hero:  1300ms;
```

Text moves 16px, cards move 24px, nothing moves more than 32px. Long travel
reads as cheap and feels laggy. Stagger siblings 110ms apart on the time clock,
maximum four in a chain, then reset.

### The easing rule

One rule decides which easing anything gets. There are no exceptions on
judgement, only the two written below.

| kind | easing | why |
|---|---|---|
| entrance | `--ease-out-quart` or `--ease-out-expo` | fast start, slow landing |
| exit | `--ease-in-quart` | the element accelerates away |
| hover, press | `--ease-spring` | and nowhere else |
| scroll-driven | `linear` | scroll position is already the easing |

`cubic-bezier` is a curve whose control points are constrained to the unit
square on the output axis, so it cannot return a value above 1 and cannot
overshoot. No arrangement of the handles produces a settle. That is the reason
hovers built on it feel flat, and it is why the spring is a `linear()` ramp
instead: an explicit list of output samples, under no such constraint, peaking
at 1.06 and settling through 0.99.

**Verified supported**, and verified to degrade safely. `CSS.supports` reports
`true` for `linear()` in the test engine. Where it is not supported, the
`var()` substitution makes the declaration invalid at computed value time and
`transition-timing-function` falls back to its initial value, `ease`: measured,
not assumed. Hovers still animate, without the overshoot.

Two things triggered by hover are deliberately **not** sprung, because they are
traversals rather than state changes: the button beam and the Ken Burns pan.
A light source crossing a button and a slow pan across a photograph both move
at constant speed. Overshoot would run the beam off the right edge and pull it
back, which reads as a bug rather than as physics.

### Page load sequence

| at | element | motion |
|---|---|---|
| 0ms | nav | none. It is persistent chrome and carries `transition:persist` |
| 0ms | sidebar card | fade and 16px rise, `--dur-slow`, `--ease-out-expo` |
| 120ms | portrait | `clip-path` wipe from `inset(0 0 100% 0)`, `--dur-slow` |
| 200ms | `h1` | per-line mask reveal, 80ms between lines, `--dur-slow` |
| 420ms | lede | fade and 16px rise, `--dur-base`, words illuminate on a 40ms step |
| 520ms | four stats | 110ms stagger, fade and 16px rise |
| 520ms | stat figures | `clip-path` wipe, then the digits count |
| 620ms | `h1` shimmer | one sweep, `--dur-hero`, starting as the second line lands |
| 760ms | capability cards | 110ms stagger |

The portrait uses `clip-path` rather than `width` so the reveal is independent
of the image dimensions and stays on the compositor.

**The stat delays are per cell and there are four of them.** Each cell's delay
matches the delay passed to its `Counter`, so the figure starts counting as the
cell holding it arrives. The chain used to stop at three while the markup had
four, which left the fourth cell on a 0s delay: it landed first, ahead of the
three meant to precede it.

### The range unit, and why reveals were invisible

**Every scroll range on this site is expressed in `cover`, never in `entry`.**
This is the single decision that made the reveals noticeable, and it is
geometric rather than a matter of taste.

An `entry` range runs from the element's leading edge touching the bottom of
the scrollport to its trailing edge doing the same, so **the length of an entry
range is the element's own height**. A percentage through it therefore lands at
a completely different place on screen depending on how tall the element is.
Measured on the deployed site under the old `entry 10% entry 70%`:

| element | height, as a fraction of viewport | centre when the reveal finished |
|---|---|---|
| skill chip | 3% | **96%**, off the bottom edge |
| project row | 13% | 47% |

Same rule, same page, and a landing position anywhere between 47 and 96 percent
depending only on element size. That is why the motion read as inconsistent and,
for most elements, was simply never seen: it finished below where anyone looks.

A `cover` range runs from the leading edge touching the bottom to the trailing
edge passing the top, a length of viewport plus element, and **its midpoint is
the element centred in the viewport whatever the element's height**. Completing
at `cover 40%` puts the centre between 60 and 70 percent of viewport height
across a thirty-fold range of heights. Measured after the change, across nine
route and selector pairs: 53 to 71 percent. `scripts/audit-motion.mjs` checks
this and fails anything outside 45 to 80.

The old rule was accidentally right once. The last-screen override used
`cover 50%`, and those were the only reveals anybody could see.

**Travel is 40px on cards, up from 24px, and 64px on the lead element.** The
earlier cap of 32px was written for time-based entrances and is wrong for
scroll-driven ones, where the reader controls the speed and a short travel is
not perceived as movement at all.

**Four vocabularies, not one.** Uniform motion normalises: the eye stops
registering it within about two sections. Cards rise and scale, list rows come
in from alternating sides, prose landmarks rise, body paragraphs rise half as
far and finish earlier. The lead element of every section travels further than
its siblings, so there is somewhere to look rather than a flat field of equal
movement. This is the same number of animations as before, with more range.

**Reverse on scroll up is kept.** It is free with a scroll timeline and it is
the behaviour Kishan asked to keep.

### Scroll reveals, per element

### The kit, seven techniques, one job each

Every element uses exactly one. Do not combine except where stated.

| # | technique | used for |
|---|---|---|
| 1 | line mask reveal, `translateY(110%)` behind `clip-path` | hero heading, every section heading, nothing else |
| 2 | fade rise, opacity plus `translateY(20px)` | paragraphs, list rows, chips, eyebrow labels (fade only, no movement) |
| 3 | blur to sharp, `blur(12px)` plus `scale(1.04)` | the five project card images **only**, never text |
| 4 | clip wipe, `inset(0 0 100% 0)` | portrait, the `$0` figure, scroll progress fill |
| 5 | staggered cascade on top of 2 | card grids, skills icon groups |
| 6 | directional slide, alternating `translateX(∓24px)` | papers list and teaching appointments only |
| 7 | counter | three of the stat figures |

| element | motion | range |
|---|---|---|
| section heading | technique 1 | `entry 15% entry 85%` |
| cards, rows, skills | technique 5 | `entry 10% entry 70%`, four-deep stagger |
| project images | technique 3 | `entry 0% entry 90%` |
| tables | fade only, no movement | `entry 10% entry 70%` |
| final section on a page | any | `entry 10% cover 50%` |
| case study prose | **none** | |
| notes page body | **none**, headings only | |

Stagger chains cap at **four**, not five.

### Counting figures

Pure CSS. `@property --num` with `syntax: '<integer>'` makes the value
animatable, `counter-reset` plus `counter()` in `::after` renders it. One
keyframe block per stat with a literal target, because animating to `var()`
inside keyframes is not reliable across engines. Wrapped in
`@supports (counter-set: x 1)`.

Counts 200 and 4. **Does not count 182,853**: `counter()` has no thousands
separator and would render `182853`. There is no CSS-only way to get the comma,
so that figure is not a counter at all. `$0` takes the clip wipe instead, since
counting to zero shows nothing.

The stats sit above the fold, so the counters run on the **time** clock with
the hero delays, not a scroll timeline: a `view()` timeline on an element
already visible at load completes immediately anyway.

Accessibility: the counting element is `aria-hidden`, and the real final value
sits beside it as visually hidden text, so a screen reader hears "200 plus
students graded" once and never an intermediate value. Under reduced motion the
final number renders statically.

### Sticky nav

`position: sticky`, `top: 0`, above content. Translucent `--color-paper` with
`backdrop-filter: blur(12px)`, and a 1px `--color-grid` bottom border that
animates in from transparent. Shrinks on `scroll(root block)` over
`0px 160px`, animating `padding` and `font-size` rather than `transform`,
because the bar must keep its layout height. That is the one permitted
exception to the transform-only rule and it is bounded to a single element.

Every heading that is a link target carries `scroll-margin-top: 6rem`. Note
that the case study's scoped `.prose h2` rule outranks the global one, so it
carries the same value explicitly.

Each grid item gets its own `view()` timeline rather than one shared timeline,
so a card entering alone still animates. Tables never move: a table sliding
while someone is reading a number is irritating. Case study prose and the notes
body get no reveal at all, because paragraph-by-paragraph fade-in on a page
someone is actually reading is hostile.

### Pass two, nine additions

| # | addition | scope | notes |
|---|---|---|---|
| 1 | skills marquee | home only | two rows, opposite directions, 40s. `/about` keeps the grouped grid: marquee for impression, grid for reference. Pauses on `:hover` and `:focus-within` per WCAG 2.2.2, static under reduced motion, `aria-hidden` because `/about` carries the real list |
| 2 | browser mockup frame | every project card | pure CSS chrome, three 8px dots, 6px frame. A raw screenshot reads as a screenshot; framed it reads as a product |
| 3 | text shimmer | the `h1` only | `@property` gradient position, `background-clip: text`, on `scroll(root block)` |
| 4 | word illumination | hero lede only | per-word spans split in markup. Used exactly once; a second instance makes it a gimmick |
| 5 | border beam | the Sieve card only | conic gradient in a masked pseudo-element, 4s linear |
| 6 | spotlight hover | project cards | rAF-throttled `pointermove` writing `--mx` and `--my`. **170 bytes gzipped** |
| 7 | section exit depth | every section | `exit 0% exit 100%`, scale 0.985 and 0.7 opacity. Gives the page depth on the way up as well as down |
| 8 | stat cell lift | the four stat cells | 1px inner highlight plus the 2px lift, so they read as objects rather than table cells |
| 9 | divider path draw | section dividers | `stroke-dasharray` on a `view()` timeline. Reuses the error-bar bracket already in section 4 rather than adding a device |

Two of these run on the **time** clock rather than a scroll timeline, for the
reason in the two-clock rule: the hero lede and the stat counters are above the
fold, where a `view()` timeline completes before the user can see it move.

### Counting figures, segmented

`Counter.astro` splits any integer into comma groups and counts each group on
its own registered property, so the comma is real text and never disappears.
The leading group uses plain `decimal`; every following group uses:

```css
@counter-style pad3 { system: extends decimal; pad: 3 "0"; }
```

so 182,853 reads `000,000` through `182,853` and never `182,5`. Verified
mid-count: `182,852` / `199+` / `391+` / `4`.

`--n` carries the target in the inline style and the keyframe animates *from*
zero, so disabling the animation, which is what both reduced motion and the
no-support fallback do, leaves the final value in place with no extra rules.

Accessibility unchanged: the counting spans are `aria-hidden` and the real
value sits beside them as visually hidden text.

### Rejected, do not implement

Typing effects, word-rotate, flip-text, morphing text, text scramble, glitch,
pixelation, particles, meteors, starfields, globes, Three.js or WebGL,
cursor followers, magnetic hover, tilt-on-hover, confetti, orbiting circles,
animated beams between elements, retro-grid or dot-pattern backgrounds,
scrollytelling pinned scenes, gooey SVG filter morphs, scroll-driven rotation,
image-sequence scrubbing, and marquees of anything other than the skills icons.

Pass three adds, all rejected for the same reasons: 3D card flips, ripple from
pointer, chromatic aberration, neon glow, glassmorphism, neumorphic depth,
cursor trails, jelly bounce, liquid fill, per-letter hover waves, equalizer
bars, image swap on hover, grayscale to colour, spinning avatars, and
`clip-path` morphs.

**The border beam is removed**, and it is worth recording why, because it was
built, shipped, found broken, fixed, and then deleted anyway.

It was a conic gradient masked to a 1px ring around the Sieve card, sweeping
three times on load. It shipped with the mask compositing as `add` rather than
`exclude`, so instead of a ring the raw gradient painted across the whole card:
a large dark wedge sweeping over the title, because `--color-plot` is a dark
green. Two independent causes, both worth knowing. Lightning CSS silently drops
the composite keyword out of the `mask` shorthand, so it has to be a longhand
declaration. And `-webkit-mask` is an alias of `mask` in Blink, so the prefixed
shorthand reset the composite back to `add` after the fact, while
`-webkit-mask-composite: xor` is not in the standard value set at all.

Fixing the mask worked, and the fixed version then argued for its own removal.
Measured over a full revolution on a 338 by 628 card: **0.82 percent of the
card's pixels change, all of them on the 1px perimeter**, with the interior
provably static across ten sampled frames. Seven seconds of animation you
notice only if you happen to be looking at the card edge. The job of pointing
at the flagship project is already done by its position, its measurement block
and its live demo link. Against that it cost three separate rendering traps and
shipped a defect that damaged the page it existed to promote. **The failure mode
was far worse than the upside**, which is the whole argument.

The test, so the same judgement can be applied to anything not listed: a
technique is out if it is cliché, hurts screen readers, is heavy, is
off-palette, or reads as junior on a portfolio whose selling point is
engineering judgement. Failing any one of those is enough.

The sharper version of the same question, and the one that decides the close
calls: **does it survive being seen fifty times by someone reading the site
properly?** A tilt effect is delightful once and nauseating on the fifth card.
Anything that draws attention to itself rather than to the content is out. This
is also why the border beam now stops after three passes and why the word
illumination appears exactly once on the site.

### The audit, and what it found

`scripts/audit-motion.mjs` loads every route and reads back what the browser
actually resolves for each animated selector: keyframes, duration, iteration
count, delay, timeline and range. It exists because source order and Astro's
scoped-style specificity mean the declaration you can read in the file is not
always the one that wins, and because none of the five bugs below were visible
in a screenshot.

Run it against the built output, not the dev server:

```sh
npm run build && npx serve dist -l 4321
node scripts/audit-motion.mjs
node scripts/verify-hover.mjs
```

It flags four shapes: an animation on the time clock with a 0s duration, an
`animation-range` on a time clock where it is inert, an infinite iteration
count, and `scroll(root)` over the full document. Two things legitimately break
those rules and are named in an allowlist in the script, so anything else with
the same shape is a real finding. They are the skills marquee, the only
permitted infinite loop on the site, and the scroll progress bar, the only thing
whose subject genuinely is the whole document.

| what | before | after |
|---|---|---|
| `h1` mask reveal | `view()`, `entry 15%` to `entry 85%`. The `h1` is above the fold on every page, so the entry range was already complete on the first frame and the animation was pinned at its end state. Measured identity transform at 39ms and still identity at 1650ms: **it had never run** | time clock, `--dur-slow`, `--ease-out-expo`. Measured 121px, 50px, 2.7px, 0 |
| `h1` shimmer | `scroll(root block)`, `0%` to `100%`, the whole 6,093px document. Measured: no movement at all by 10% scroll, completing only at the very bottom. This was the "too slow" complaint | time clock, `--dur-hero`, one sweep, complete by 1.9s |
| capability cards | 0s duration. `.card-grid > *` re-declares the `animation` shorthand, which resets duration to 0s and easing to linear; `.focus > *` then restored `animation-timeline: auto` but not the duration, so the cards snapped after their delay | `--dur-base`, `--ease-out-quart`, and the inert range cleared |
| stat cells | four cells, three `nth-child` delays. The fourth inherited 0s and landed first | four delays, matching each cell's `Counter` |
| border beam | `4s linear infinite` | `2.4s linear 3`, then it stops |
| header fade | dead rule. `.hero-nav` is `(0,1,0)`; Nav.astro's scoped `.site-header` carries the astro-cid attribute and outranks it, so the header ran `nav-shrink` and never faded | removed, along with the class. It is persistent chrome and should not fade in on every navigation |

The beam is a spotlight, not a heartbeat. Something that never stops moving
stops meaning anything, and a permanent animation on a site about measurement
discipline reads as decoration. Three passes is long enough to be noticed and
short enough to be over. Confirmed by measurement: 9 seconds after load, with no
scrolling, the marquee is the only thing still running on the time clock.

**Three reveal classes are declared and unused.** `.reveal`, `.reveal-text` and
`.reveal-label` appear zero times in the built markup across all twelve routes.
They are kept as the documented escape hatch for new markup, and noted here so
the next person does not read them as live.

### Coverage, audited per route

The reveal system reached card grids, list rows, section headings, skills and
data tables, and nothing else. Prose was never covered, so five of the twelve
routes had essentially no scroll motion:

| route | scroll-driven elements, before |
|---|---|
| `/notes` | 0 with a range. Uses `.story`, `.hook`, `.sub-h`, none of them targets |
| `/work/gatekeepnt`, `/atctm`, `/moodlens`, `/moodinsight` | 0 with a range |
| `/work/sieve` | 8, only because it is the one case study with tables |

`/papers` and `/teaching` did have reveals, 12 and 18 elements respectively.
The complaint that the sub-pages had none was right about `/notes` and four of
the five case studies and wrong about those two.

Prose reveals in two weights. Landmarks, the things you scan for, rise 28px on
every page: headings, figures, tables, lists, quotes, code blocks and
measurement blocks. Body paragraphs rise 16px and finish earlier, at
`cover 36%`, so a paragraph is settled well before it reaches the line being
read.

Paragraphs are included after **counting what is actually on the pages**: four
of the five case studies contain no headings at all, only paragraphs and a
single list, so a landmarks-only rule left them with one animated element each.
This is coverage of the existing reveal, not a new technique.

**Paragraphs do not move on the two long-form pages.** On a page of three or
four paragraphs the reveal reads as the page arriving. On `/notes` and
`/work/sieve`, which are read straight through, text fading in as you scroll
fights the reading: the thing you are moving toward is never still. Those two
get landmarks only.

The switch is the heading count, because that is what actually separates the
long pages from the short ones. `CaseStudy.astro` adds `is-longform` to
`.prose` when the entry has `h2` sections, and `/notes` is excluded wholesale
since the entire page is long-form. Verified per route: `/work/sieve` animates
0 of 39 paragraphs and 24 of 24 landmarks, `/notes` 0 of 17 and 8 of 8, and
each short case study animates all of its paragraphs.

### The persisted sidebar

`transition:persist` was doing its job and was not the cause. Measured after a
client-side navigation: the `.profile` node is the same object, attributes and
all, and `reveal-up` is nonetheless running again at 217ms having been finished
at 1000ms before the navigation.

Persist keeps a node. **A CSS animation is not part of a node's state.** The
router detaches the persisted element and re-attaches it into the new document;
an animation on an element that leaves the document is canceled, and
re-insertion starts it from zero. No attribute prevents this, so the entry is
switched off instead: `astro:after-swap` sets `data-navigated` on the document
element, in the same task as the swap so it applies before the restarted
animation can paint, and the sidebar's entry rules are disabled from then on.
It is never cleared. Once you have navigated, the sidebar has introduced itself.

Keep comments inside an `is:inline` script short. Astro ships them to every page
byte for byte and never minifies them: a fourteen line explanation there cost
**426 bytes gzipped on every route**, which is why this one lives in CSS, where
Lightning CSS strips it.

### Scroll progress

A 2px bar fixed to the top of the viewport in `--color-plot`, `scaleX` 0 to 1
on `animation-timeline: scroll(root block)`. One rule, no JavaScript,
`aria-hidden`.

### The hover system

A hover is a gesture, not a property change. Each of these moves three or four
things on one duration and one easing so they read as a single response. All of
them run at `--dur-fast` on `--ease-spring` with a 0s delay, which is what makes
them arrive together rather than in sequence. A stagger inside a hover says "a
sequence is starting"; a hover is a direct answer to the pointer.

| element | what moves |
|---|---|
| project card | image `scale(1.06)` inside the frame, card `translate` -3px, border to `--color-plot`, arrow nudges 5px, image `saturate(0.92)` to `saturate(1)` |
| Sieve card, additionally | Ken Burns pan, `translate` 0 to -3%, 6s, linear, only while hovered |
| skill item | icon `scale(1.18)` and to `--color-plot`, label `--color-ink-3` to `--color-ink` |
| nav link | underline via `::after`, `scaleX` 0 to 1, origin left, 240ms |
| button | 45 degree beam sweeping across once, plus `scale(0.98)` on `:active` |
| stat cell | `scale(1.02)` plus a 1px inset highlight |
| inline prose link | underline thickening, and nothing else |

Prose links stay plain on purpose. A link that does tricks is irritating to read
past, and body copy is full of them.

**The image zooms, the card does not resize.** The zoom happens on the `<img>`
inside `.screen`, which is `overflow: hidden`, so nothing below the card
reflows. `padding-right` on the case study link reserves the 5px the arrow
travels into, for the same reason.

**Every hover fires on keyboard focus.** Containers use `:has(:focus-visible)`
rather than `:focus-within`: a keyboard user gets the whole gesture, and a mouse
user who clicks a link inside a card does not get a hover state stuck on after
the pointer leaves. Focusable elements use `:focus-visible` directly. Skill
items are the one exception, and honestly so: they are not interactive, there is
nothing to focus, and adding forty tab stops of non-interactive content to make
a selector fire would be an accessibility regression rather than a fix.

#### The property collision, and the Lightning CSS trap

Two rules, both learned by measuring rather than reading.

**An animation with `fill-mode: both` owns the properties it names, for good.**
Animated values sit above normal declarations in the cascade, so no specificity
saves a hover. Every card on this site is also a reveal target, and `reveal-up`
ends at `transform: none`, so the card lift written as `transform` never
appeared at all. The lift is on `translate`, the zoom is on `scale`, and the
pan is on `translate` on a different element. `translate`, `rotate` and `scale`
are independent properties that compose with `transform` rather than competing
with it, which is what lets three effects run on one subtree.

**Never put `transform` in the same rule as `scale` or `translate`.** Lightning
CSS folds the three into a single `transform` declaration. That is only
equivalent when nothing else sets `scale` or `translate`, and here things do, so
the fold silently drops two of the three resets. It cost the whole reduced
motion block: `transform: none; scale: none; translate: none` came out as
`transform: scale(1) translate(0)`, and every hover stayed live under
`prefers-reduced-motion`.

Two things make this hard to find. Lightning CSS runs via `@tailwindcss/vite`
regardless of `vite.build.cssMinify` in `astro.config.mjs`, so the `esbuild` pin
that fixed the `animation-timeline` fold does not cover it. And it happens with
minification off as well, so it is a normalisation rather than an optimisation
and there is no setting to disable. Keep them in separate rules. Rules with
identical selectors get merged first, so separate rules with the *same* selector
are not enough either.

### Modern CSS in place of script

**`@starting-style` with `transition-behavior: allow-discrete`** for the mobile
nav, so open and close both animate with no opacity-and-visibility hack.
`display` is discrete and has no in-between values, so a plain transition flips
it at the start and there is nothing to watch on the way out. `allow-discrete`
holds the old value for the length of the transition, which keeps the panel
painted while it fades away; `@starting-style` supplies the values to animate
*from* on the first frame the element is rendered with a `display` other than
`none`, which a plain transition has no previous value for. Exit uses
`--ease-in-quart`, entrance `--ease-out-quart`.

**`interpolate-size: allow-keywords`** on `:root`, so the case study rail's
`<details>` animates to `height: auto` through `::details-content` with no
measuring script. Guarded on both features and never load bearing: the `[open]`
rule sets `block-size: auto` unconditionally, so the worst case in a browser
with one feature and not the other is a panel that snaps open, which is what it
did before. There is no state in which the sections list is unreachable.

**Neither changed the JavaScript byte count**, and the honest reason is that
neither replaced JavaScript in this codebase. `@starting-style` replaced a CSS
hack, and the class toggle it animates is still needed to mark the open state.
There was never a measuring script on the rail: the panel simply snapped.
Measured 6,533 bytes gzipped on the worst route before and after, byte for byte
identical on all twelve routes.

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

The hover states still change under reduced motion, they just change instantly:
the blanket `transition-duration` handles that, and the affordance has to
survive or the site becomes harder to use for the people the rule protects. What
is removed is anything that moves geometry. Each of those resets touches exactly
one of `transform`, `scale` or `translate` and never two in one block, for the
Lightning CSS reason above. Verified by hovering every interactive element under
`prefers-reduced-motion: reduce` and reading the computed values back: card does
not lift, image does not zoom or pan, arrow does not nudge, stat cell does not
scale, button beam is gone, marquee and border beam are static.

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
- Total client-side JavaScript under **16 KB gzipped on the worst route**, raised from 10 KB when the contact form and the keycap were added. If a bundle analysis shows a framework runtime shipping, that is still a bug: nothing here needs one.

  Measured by `scripts/js-budget.mjs`, which attributes every inline block and counts JSON-LD separately, because structured data the browser never executes does not belong in a JavaScript budget.

  Worst route is `/contact` at **8,037 bytes**, leaving 8,347 bytes of headroom. What each route carries above the lightest one:

  | addition | route | gzipped |
  |---|---|---|
  | contact form, validation and copy button | `/contact` | 1,039 |
  | keycap, drag and press | `/about` | 570 |
  | case study rail observer | the five case studies | 361 |

  The shared floor of 6,998 bytes is the router, the pre-paint theme script, the theme toggle, the mobile nav and the delegated spotlight. The spotlight is 356 bytes for the whole site: it was one listener per project card and is now one on `<main>`, which is what let it grow from five cards to every card on the site without the cost growing with it.
