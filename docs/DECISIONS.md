# DECISIONS.md

Decision record for this repository. Format is defined in CLAUDE.md. Append new entries at the bottom, do not rewrite old ones.

## D-001: Replace the em dash in DESIGN.md section 5 with a comma, and standardise the dash check
Date: 2026-08-05
Decided by: Kishan
Alternatives considered: Leave it as a knowing exception in a decided document. Use a colon instead of a comma. Verify cleanliness with a shell escape like $'\u2014'.
Reasoning: Rule 2 admits no exceptions, including the docs that state the rule. The check is `grep -nP '[\x{2010}-\x{2015}\x{2212}]' -r .` or a python scan over the same character class. A $'\u2014' shell escape fails silently in a non-bash shell and returns a false clean, so it is banned as a verification method.
What would change this: Nothing. The rule is standing.

## D-002: Measurement component provenance and reason contract by state
Date: 2026-08-05
Decided by: Kishan
Alternatives considered: Require provenance in every state and add provenance strings to the two unmeasured blocks in CONTENT.md. Let reason double as provenance on unmeasured blocks without enforcement.
Reasoning: measured requires provenance and forbids reason. unmeasured forbids provenance and requires reason, because nothing was measured, so there are no conditions to state, and reason carries it. withdrawn takes optional provenance and requires reason. Every violation throws at build time, including provenance supplied on an unmeasured block. CONTENT.md is untouched.
What would change this: A future state that reports a partial or superseded measurement with real conditions attached.

## D-003: --text-data-big is Plex Mono 500, --text-data stays 400
Date: 2026-08-05
Decided by: Kishan
Alternatives considered: Keep --text-data-big at 400 and move measurement-block numbers out of the display role.
Reasoning: The typography role table already assigns measurement-block numbers to the weight 500 display role. The scale comment was the error, so it moves to 500 and the table stands as written.
What would change this: A legibility problem with Plex Mono 500 at the clamped sizes on real devices.

## D-004: Scope the coursework grade ban to Northeastern, with three named permissions
Date: 2026-08-05
Decided by: Kishan
Alternatives considered: Ban all grade information including the About page line. Treat anything already written in CONTENT.md as permitted by definition.
Reasoning: Banned is any grade, score, or result from his Northeastern coursework, including individual assignments, exams, oral exams, and per-course grades. Permitted: the two cumulative GPAs, First Class with Distinction, and the undergraduate subject-level distinction line in CONTENT.md section 9. The permitted items are degree-level facts he already publishes. Per-course Northeastern results stay private.
What would change this: Kishan revising the About copy.

## D-005: Delete the contradictory clinical text simplification hybrid-rank sentence
Date: 2026-08-05
Decided by: Kishan
Alternatives considered: Guess which of the two ranks was the typo and correct it in place.
Reasoning: The sentence claimed hybrid's number one was neither ranker's top pick while also stating vector rank 1, which contradicts itself. Only the bench output can say which number is wrong, and no fact ships without a source. The rank 33 to hybrid 3 sentence stands. A PENDING KISHAN line records the recheck.
What would change this: The recheck. If the true ranks support the claim, it returns with corrected numbers.

## D-006: State the p99 spread as 4.9x and drop the unreconciled 95.8 low end from the notes table
Date: 2026-08-05
Decided by: Kishan
Alternatives considered: Keep the 4x figure. Keep both low ends, 83.8 and 95.8, and let them disagree.
Reasoning: 406.9 divided by 83.8 is 4.86 and this site does not round to a flattering integer. The notes table row now reads "published at the favorable end of an observed range extending to 406.9 ms" so it no longer anchors on a low end that conflicts with the Sieve p99 block. A PENDING KISHAN line records the reconciliation of 83.8 against 95.8.
What would change this: Bench output showing the two ranges came from different run sets, at which point both low ends can return with their run identities stated.

## D-007: Replace the recall ceiling sentence with a plateau range
Date: 2026-08-05
Decided by: Kishan
Alternatives considered: Keep "ceiling at ef=640 is 0.989" and label the hero figure as a different recall depth.
Reasoning: The hero table reports 0.9898 at ef=800, which sits above a stated ceiling of 0.989, so ceiling was the wrong word. The line now reads: "Recall plateaus in the 0.989 to 0.990 range by ef=640. The limit is the m and ef_construction build parameters, not search depth." Both published figures fit inside that range without rounding either.
What would change this: Re-measurement against the post-dedup corpus.

## D-008: AGENTS.md stays, with two working rules recorded in CLAUDE.md
Date: 2026-08-05
Decided by: Kishan
Alternatives considered: Delete AGENTS.md. Rewrite it to remove the inapplicable links.
Reasoning: The Astro documentation links are useful. Run `astro dev stop` before any production build, never both at once, because the machine is an 8 GB fanless M1. The React, Vue, Svelte and internationalization links in AGENTS.md do not apply to this project and are to be ignored.
What would change this: Astro regenerating the file with different content, or a hardware change.

## D-009: Add apple-touch-icon.png, ci.yml, and DECISIONS.md to the SPEC file tree
Date: 2026-08-05
Decided by: Kishan
Alternatives considered: Leave the tree incomplete since the prose sections already require all three files.
Reasoning: The tree is the part that gets skimmed during implementation. Files required by SPEC sections 7 and 8 and by CLAUDE.md belong in it.
What would change this: Nothing likely.

## D-010: Disambiguate the two decisions files
Date: 2026-08-05
Decided by: Kishan
Alternatives considered: Rename this repo's docs/DECISIONS.md.
Reasoning: CONTENT.md section 3 referenced "docs/decisions.md", meaning the Sieve repository's own file, not this repo's DECISIONS.md. Two near-identical names across two repos invite a misread. One clarifying clause removes it.
What would change this: Nothing likely.

## D-011: Fix the "mobit" typo in SPEC.md section 2
Date: 2026-08-05
Decided by: Kishan
Alternatives considered: None. It is a typo.
Reasoning: "mobit" becomes "mobile".
What would change this: Nothing.

## D-012: The resume link ships in the footer, and CONTENT.md section 10 is amended to match
Date: 2026-08-07
Decided by: Kishan
Alternatives considered: Follow CONTENT.md literally and keep the resume out of the footer. Put it only on /about.
Reasoning: SPEC.md section 2 requires a plain `Resume (PDF)` link in the footer and on /about, while CONTENT.md section 10's verbatim footer block omitted it. SPEC is right about the requirement, so the link is added to Footer.astro pointing at `/kishan-prajapati-resume.pdf` and CONTENT.md section 10 is amended so the two documents agree. The PDF itself is placed by hand and does not exist yet.
What would change this: Kishan deciding the resume should not be linked site-wide.

## D-013: The "Source at" line stays out until the repository is public
Date: 2026-08-07
Decided by: Kishan
Alternatives considered: Ship a placeholder link now. Link the GitHub profile instead of the repository.
Reasoning: A link to a private repository is a dead link, and a placeholder is a fact that is not yet true. Phase 6 must add the source line once the repository is public. This is a Phase 6 obligation, not an optional polish item.
What would change this: The repository becoming public, which triggers the Phase 6 addition.

## D-014: Nav links keep the label role with no underline, ratified as built
Date: 2026-08-07
Decided by: Kishan
Alternatives considered: Give nav links the same 1px to 2px underline treatment as prose links.
Reasoning: DESIGN.md section 3 assigns nav to the "data and labels" role and section 7 describes the underline animation for links generally without settling nav. Underlining five uppercase mono labels in the header reads as clutter, and the current page is already marked by the `--color-plot-soft` background plus `aria-current`. Colour is not the only carrier of meaning, so the accessibility floor holds.
What would change this: A keyboard or screen reader review finding the nav affordance unclear.

## D-015: The theme toggle keeps its visible readout and gains an action-stating aria-label
Date: 2026-08-07
Decided by: Kishan
Alternatives considered: Leave the accessible name as the visible readout text. Replace the readout with an action label.
Reasoning: The visible text stays as "theme: light" or "theme: dark", which reports the current state. The aria-label is set dynamically to "Switch to dark theme" when light is active and "Switch to light theme" when dark is active, so assistive tech announces the action rather than the state.
What would change this: See the open question recorded against this entry: the button also carries `aria-pressed`, and an action-stating name alongside a pressed state is contradictory to announce. WCAG 2.5.3 Label in Name also expects the accessible name to contain the visible text, which it now does not. Both are open for a follow-up call.

## D-016: Delete src/layouts/Layout.astro
Date: 2026-08-07
Decided by: Kishan
Alternatives considered: Keep it as a gutted stub.
Reasoning: Base.astro is the site layout per SPEC.md section 3. The template's Layout.astro was gutted in Phase 0 rather than deleted only because the instruction said gut. Nothing imports it and it renders nothing, so it is dead weight that invites a future import of the wrong layout.
What would change this: Nothing.

## D-017: Mobile nav breakpoint moves from 640px to 768px
Date: 2026-08-07
Decided by: Kishan
Alternatives considered: Keep 640px, matching the breakpoint where the graph paper background is hidden.
Reasoning: 768px is the gutter breakpoint in DESIGN.md section 4, so the nav now collapses at the same width the layout already changes at, and there is one fewer arbitrary number in the stylesheet. The graph paper background stays at 640px because that value is specified verbatim in DESIGN.md section 4 and serves a different purpose.
What would change this: The five nav items crowding between 640px and 768px on a real device.

## D-018: No tool, framework, or AI attribution anywhere in the artifact
Date: 2026-08-07
Decided by: Kishan
Alternatives considered: Keep the conventional "Built with Astro" footer credit. Keep co-author trailers on commits.
Reasoning: The site and the repository are Kishan's work and read as his work. "Built with Astro" is removed from Footer.astro and from CONTENT.md section 10, leaving contact, the four profile links, the resume link, and the auto-generated "Last measured" line. A standing rule is recorded in CLAUDE.md covering user-facing strings, commit messages, PR descriptions, the README, code comments, and meta tags, including a ban on co-author trailers and README badges. CLAUDE.md and .claude/ are added to .gitignore and CLAUDE.md is removed from the index with `git rm --cached`, so it stays on disk but leaves the artifact. AGENTS.md and docs/ stay tracked. The Astro template README is replaced with a plain one covering what the site is, how to run it, where content lives, and the CONTENT.md rule. Naming a command that has to be run is documentation and stays permitted.
What would change this: Nothing on the site. A hosting provider requiring an attribution line would need its own decision.

## Open item recorded against D-018: existing history carries one attribution trailer
Date: 2026-08-07
Decided by: Kishan, pending
Alternatives considered: Not yet decided. Reported for a call, no history was rewritten.
Reasoning: Commit 9efe12e carries `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` in its body. Commit 745902b carries no trailer, though its subject line is `"Initial commit from Astro"`, which names the tool. No "Generated with" trailer exists anywhere in history. Both predate D-018.
What would change this: Kishan deciding whether to rewrite the two commits before the repository goes public. Once it is public and cloned, rewriting becomes disruptive.

## D-019: The theme toggle computes its accessible name from its own contents. Supersedes D-015.
Date: 2026-08-07
Decided by: Kishan
Alternatives considered: Keep D-015 as written. Drop `aria-pressed` and keep the `aria-label`.
Reasoning: D-015 was wrong and is withdrawn. It produced two defects at once. `aria-pressed` announced a toggle state that does not exist, since choosing a theme is a choice between two named states rather than pressing something on or off. The `aria-label` then replaced the accessible name with text that did not contain the visible label, which fails WCAG 2.5.3 Label in Name and leaves a speech input user unable to activate the control by saying what they see. Dropping `aria-pressed` alone does not fix that second defect, because the overriding label is the cause. The rebuilt button carries no `aria-pressed` and no `aria-label`. It renders both states in its own markup, with the action in an `.sr-only` span, so the name computes from contents to "theme: light, switch to dark" and the reverse in dark. CSS selects the visible state from the `.dark` class that the inline script in Base.astro already sets before first paint, which also removes the script's old job of writing the button text and removes a flash of the wrong state.
What would change this: A screen reader review preferring the state and action to be split across name and description.

## D-020: The .dark token block moves after the :root block in global.css
Date: 2026-08-07
Decided by: Kishan
Alternatives considered: Raise the dark selector to `html.dark` to win on specificity. Move `color-scheme` into a layer.
Reasoning: `.dark` and `:root` both have specificity (0,1,0) and both are unlayered, so source order alone decided the winner and `:root` was last. `color-scheme` therefore stayed `light` while the page rendered dark, so the browser painted light scrollbars and light form control chrome on a dark page. Reordering fixes it at the cause. Specificity is deliberately not raised: keeping both token blocks flat means either can be overridden later without starting an escalation, and the fix stays legible to the next reader.
What would change this: Nothing. A comment in global.css records why the order matters so it is not resorted by accident.

## D-021 to D-026: reserved, not yet received
Date: 2026-08-07
Decided by: Kishan, pending
Alternatives considered: None.
Reasoning: These numbers were referenced as adjudicated but their content has not reached the build. They are held open so the numbering does not collide when they arrive. Phase 2 and Phase 3 shipped without them.
What would change this: Kishan re-sending them.

## Phase 2 and Phase 3 working notes

From here, minor ambiguities in DESIGN.md or SPEC.md are resolved in the direction most consistent with the surrounding spec and recorded as a single line rather than escalated. The following calls were made while building Phase 2 and Phase 3.

- D-027: Sieve's `status` is `shipped`. CONTENT.md gives no status word and the enum forces one. The build was completed and the system runs, and the outstanding items are extensions, not unfinished work.
- D-028: Added an optional `hardware` field to the collection schema. SPEC.md section 4 describes a rail note giving the hardware the work was measured on but provides no field for it, and hardcoding it in the layout would make it Sieve-specific.
- D-029: `repo` and `demo` use `z.url()` rather than SPEC.md's `z.string().url()`. Same validation, but the bundled Zod deprecates the older form and it raised two check hints.
- D-030: Card art is resolved by filename with `import.meta.glob` rather than through the schema's `cardArt` field, so dropping a PNG into `src/assets/work/` fills the slot with no frontmatter edit. `cardArtAlt` is already set in frontmatter, so the alt text is waiting for the file.
- D-031: A card with no art keeps a 16 by 9 slot with a hairline border and the recessed panel fill, so the card reads as a quiet empty plot area rather than a broken image.
- D-032: Featured work on the home page reads from the collection and sorts by `order`, so entries added in Phase 4 appear without editing the home page. The MoodLens live demo link renders from the first entry carrying a `demo` field, so it appears when MoodLens lands in Phase 4.
- D-033: The sticky rail tracks the current section with a small IntersectionObserver. SPEC.md section 5 requires the tracking and DESIGN.md section 9 caps client JavaScript at 10 KB while naming only the theme toggle and mobile nav. The observer is a few hundred bytes with no framework, so the budget holds and the stated criterion is met.
- D-034: The error bar maps its range onto the middle 80 percent of the track. DESIGN.md section 5 fixes the bar's shape but not its domain, and insetting keeps the end caps off the edge of the block.
- D-035: The hero curve animates through `pathLength="1"`, which normalises the path so the dash animation needs no measured length and therefore no JavaScript.

## Phase 4 and Phase 5 working notes

- D-036: Gatekeepn't uses `title: Gatekeepn't` with CONTENT.md section 4's "Title on the site" string as the subtitle. Both strings ship, the card and nav read as a project name, and the h1 does not become a full sentence.
- D-037: Gatekeepn't's `stack` is the single entry "held back while the paper is under review". The schema requires at least one entry and Variant A deliberately says "three model architectures" without naming them. Naming the models would go past the publishing gate, so the row states the embargo in CONTENT.md's own words instead.
- D-038: Statuses not given as a word in CONTENT.md: ATCTM is `ongoing` (December 2024 to present), MoodLens is `live` (the only publicly running thing), MoodInsight is `archived` (completed during a finished assistantship).
- D-039: `timeline` and `team` became optional in the schema against SPEC.md section 4, which requires both. CONTENT.md states neither for MoodLens or MoodInsight. Rule 1 outranks schema strictness, so the row is omitted rather than filled with an inferred date.
- D-040: MoodLens's subtitle, "Six attributes from one piece of text, in real time", is a compression of CONTENT.md's own sentence rather than a new claim. CONTENT.md gives no subtitle for it.
- D-041: `apple-touch-icon.png` is generated from the favicon's own geometry by a short script rather than by hand or by an image model, so the two icons cannot drift. 180 by 180, opaque `--color-paper` background, bars in `--color-plot`, all four sharing the baseline at y=169. 557 bytes.
- D-042: The mandatory ATCTM status correction and the MoodInsight 88.10 percent framing both render inside `Caveat`, which is the component reserved for caveats and limitations and the only correct home for `--color-annot`.
- D-043: The notes page carries two `withdrawn` measurement blocks alongside the table of six. DESIGN.md section 2 restricts `--color-withdrawn` to the notes page and withdrawn values, and the state had no on-site use until now.
- D-044: `public/og-default.png` is referenced by the Open Graph tags but deliberately left absent, as instructed, so the tag is correct the moment the file lands.

## Card layout working notes

- D-045: The site is built from containers rather than one continuous scroll. `Card.astro` is the primitive and DESIGN.md section 4 now documents it, superseding the parts of that section that assumed a single flowing column.
- D-046: The headshot renders at 200px with `densities={[1, 2]}` and quality 90, emitting 6,110 bytes at 1x and 16,188 bytes at 2x. `astro:assets` was not bypassed: the 2 kB output was purely the old 140px size, and sharp produces byte-identical output at the same settings, so the pipeline is not degrading the photo. The quality curve at 400px is q80 8,984, q90 16,188, q95 28,932, q100 44,348, and lossless PNG 290,028.
- D-047: Project cards carry a `Measurement` only where CONTENT.md records a measured number, so Sieve, Gatekeepn't and MoodInsight have one and ATCTM and MoodLens do not. A card is not a reason to invent a figure.
- D-048: The two featured cards on the home page suppress their `Measurement`, because the same two numbers already appear in the dedicated measurement cards higher up the page.
- D-049: `ProjectCard` takes a `headingLevel` prop. The card sits directly under the h1 on `/work` and under an h2 on the home page, so a fixed level would have skipped a heading on one of them.
- D-050: The carded measurement row uses nested subgrid, with the card as the outer subgrid item and the measurement nesting inside it, so the value lines still align across all three cards without `display: contents` on an interactive element.
- D-051: `DataTable` gained a `card` prop rather than becoming carded by default, because `/notes` keeps flowing tables. With `card` the title moves outside the scroll region so it does not scroll away, and a visually hidden `caption` keeps the table's own accessible name.
- D-052: `/about` puts work authorization in a card alongside education, work history and certifications, since the four read as one band of reference facts. The line itself is unchanged and still appears nowhere else.

## Reference-matched layout working notes

The site was rebuilt against a live reference rather than a description. Method and measured values are in `ref/ANALYSIS.md`, which is gitignored working material.

- D-053: The graph paper background is removed. It fought the flat card-based layout and the reference field is a single unbroken surface. One rule in `global.css` restores it.
- D-054: The two-column shell, the display scale and the two-tone heading are taken from measured values, not from the image. Documented in DESIGN.md section 4.
- D-055: Display and section headings carry **zero** tracking. The brief said "wide tracking"; the reference measures `letter-spacing: normal` on both display sizes, and its only non-zero tracking is negative. Building from the description would have shipped loose display type that looked nothing like the reference.
- D-056: Plex Mono 600 was added for the display roles, because the reference display is 700 and Plex Mono's static package tops out at 600. That brings a latin reader to exactly four font files, the ceiling in DESIGN.md section 3.
- D-057: The h1 reads "Software Engineer". CONTENT.md gives the role line as "MS Computer Science student" and does not carry this as a self-description, but CLAUDE.md's own opening states the site exists to get Kishan a software engineering co-op, and the lede immediately underneath gives the accurate student framing. Flagged for a one-word veto.
- D-058: The two hero capability cards exist to balance the hero against the 640px sticky column, which is taller than a heading, lede and stat row on their own. Every string in them is a stack fact already in CONTENT.md sections 2, 3, 4 and 5.
- D-059: Radius stays at our 3px rather than the reference's 8 and 16px, and cards keep their 1px hairline where the reference separates by surface colour alone. Radius is a token and the brief said keep the tokens. This is the largest deliberate difference between the two designs.
- D-060: `scripts/shoot.mjs` gained a `REVEAL=1` mode. The reference animates sections in on scroll, and a full-page screenshot re-arms those animations and captures blank bands. The first capture silently lost three whole sections.

## Ratified, superseding the reference-matched notes above

Three of these numbers were reassigned. Where a number appears twice, the entry below is authoritative and the earlier one is superseded.

- D-055: Radius follows the reference after all. Cards 8px, large panels and the sidebar 16px, small controls 6px. "Keep the tokens" meant colour and type, not geometry. Hairlines stay 1px. Supersedes the earlier D-055 and D-059.
- D-056: The home h1 stays `SOFTWARE ENGINEER` and is now recorded in CONTENT.md section 1 as an approved positioning line rather than a claimed job title. Supersedes the earlier D-056 and D-057.
- D-057: The two hero capability cards are ratified as built.
- D-061: Variant B is deleted from the repository and stripped from CONTENT.md section 4, which now carries only Variant A plus a one-line note recording the removal. It is not held as a draft file and is not recoverable from this repository. History was collapsed to a single orphan commit and force pushed.
- D-062: Case study pages with no `h2` fall back to the profile card in the sidebar rather than rendering an empty "Sections" rail. Only Sieve has sections.
- D-063: The display floor is `11.5vw` rather than a fixed 52px. Plex Mono is far wider per character than the reference's geometric sans, and a long word like MEASUREMENTS overran a 390px viewport at a fixed 52px. It still resolves to the reference's 52px from 452px up.
- D-064: `DataTable` prose cells wrap and only the header row stays on one line. Nowrap on every cell pushed the notes table past the viewport instead of scrolling inside its wrapper.
- D-065: Footer links moved from inline comma-separated anchors to a flex list. The markup collapsed the whitespace around the commas and the links ran together.

## Plain-English content pass

- D-066: The collection schema's `summary` cap moves from 240 to 260 characters. The approved Sieve summary is 245 and the cap was an arbitrary meta-description budget, not a measurement, so the copy wins.
- D-067: Every item leads with a plain sentence saying what it is, then the technical detail. Eleven named terms are barred from card summaries, capability cards and above-the-fold copy, and either carry a half-clause of explanation on first use or move into a case study. Recorded in CONTENT.md so the doc governs future copy.
- D-068: The capability card reads "1,875 times slower" rather than the drafted "1,800 times". CONTENT.md requires numbers to keep their precision, and 1,875x is the figure in the performance table. Revert in one word if the round number was deliberate.
- D-069: "About 10 milliseconds" is kept as the plain-English rendering of the 9.9 ms end-to-end median. It is explicitly approximate, and the exact figure with its conditions still sits in the Sieve case study.
- D-070: Measurement blocks came off the `/work` cards. Their labels and provenance carry the barred vocabulary, and the same numbers are on the case studies where that vocabulary belongs.
- D-071: The Sieve stack order changed so the first four entries, which are the only ones that become chips, are names a recruiter recognises. The full stack still renders on the case study.

## Motion system

- D-072: Scroll reveals use CSS scroll-driven animations on `animation-timeline: view()`. No IntersectionObserver, no library, no added client JavaScript. The hidden start state lives inside the `@supports` guard, so an unsupported browser gets visible static content rather than blank space.
- D-073: `vite.build.cssMinify` is pinned to `esbuild`. Lightning CSS folds `animation-timeline` into the `animation` shorthand, emitting `animation: linear both reveal-up view()`. That is valid CSS Animations Level 2 and no browser implements it, so the declaration is dropped, `animation-name` computes to `none`, and every reveal freezes in its start state. It fails silently and only in the production build.
- D-074: Stagger on a scroll timeline is an `animation-range` offset, not a delay. A scroll timeline has no time axis, so `animation-delay` is meaningless there. Siblings step 5 percent of entry apart, five deep, then the cycle resets.
- D-075: The last-screen selector is `.section:last-of-type` plus `.shell-main > :last-child`. The obvious `main > :last-child` matches the shell wrapper and silently applies the last-screen range to every card and row on the page.
- D-076: `ClientRouter` added with `fallback="animate"`, fade at 240ms. The theme toggle, mobile nav and case study rail rebind on `astro:page-load` behind a `data-bound` guard, the theme class is reapplied on `astro:after-swap` to prevent a flash, and the profile sidebar carries `transition:persist` so it does not replay its entry animation on every navigation.
- D-077: Stat figures reveal with a `clip-path` wipe rather than counting up. Counting needs JavaScript, screen readers read the intermediate values, and it is a cliche.

## Motion fixes and the skills section

- D-078: CONTENT.md gains section 13, SKILLS, on Kishan's instruction, with his provenance notes in brackets. Unbracketed items are canonical but less strongly sourced. PHP is deliberately excluded.
- D-079: The line mask uses `clip-path: inset(0)`, not `overflow: hidden`. `overflow: hidden` makes the element a scroll container, and `view()` resolves against the nearest scroll container, so the inner span measured itself against its own mask and read as fully in view from the first frame. Every heading revealed on load. `view(root)` is not a fix: `view()` takes only an axis and an inset, and the invalid value falls back to `animation-timeline: auto`.
- D-080: Skill icons are hand-authored generic marks indicating what kind of thing each item is, not brand logos. SPEC.md section 1 bans an icon package, and hand-drawn approximations of thirty-two trademarked logos would look wrong and be legally awkward.
- D-081: The counters run on the time clock, not a scroll timeline, because the stats sit above the fold where a `view()` timeline completes immediately. One keyframe block per stat with a literal target, since animating to `var()` inside keyframes is unreliable.
- D-082: 182,853 is not a counter and has no CSS-only comma. `counter()` renders digits with no thousands separator, so it is left static rather than shipped as `182853`.
- D-083: The case study's scoped `.prose h2` scroll-margin outranked the global rule, so anchor jumps landed under the pinned nav. It carries 6rem explicitly.

## Real icons

- D-084: Skill marks are real Simple Icons paths, not hand-authored generic marks. SPEC.md section 1 bans an icon component library, not inlined SVG path data, and a generic shape is unrecognisable as Docker. Supersedes D-080.
- D-085: The paths are vendored into `src/data/icons.ts` by `scripts/fetch-icons.mjs` rather than fetched during `astro build`. Pinning them keeps builds reproducible and offline-capable, and keeps CI from depending on jsdelivr. `@latest` would otherwise let a mark change silently between two builds of the same commit. Re-run the script to refresh.
- D-086: Licence recorded as CC0-1.0, read from the simple-icons package manifest rather than assumed. Version pinned at 16.28.0 in a comment.
- D-087: SQL has no mark in the set and renders as a text chip. No generic mark is substituted for a missing icon: a wrong-looking mark is worse than an honest word.

## Animation pass two

- D-088: 182,853 counts after all, via segmented counters. `Counter.astro` splits any integer into comma groups, the leading group uses decimal and the rest use a pad3 counter style, so the figure is never malformed mid-count and the comma is real text. Supersedes D-082.
- D-089: The counter target lives in the inline style and the keyframe animates from zero, so disabling the animation leaves the final value in place. Reduced motion and the no-support fallback both need no extra rules.
- D-090: The home stats became four cells: 182,853 papers, 200+ students, 400+ LeetCode, 4 papers. All four are in CONTENT.md sections 2 and 9. The $0 infrastructure figure moves out of the stat row and stays in the Sieve case study.
- D-091: The skills marquee is home only and `aria-hidden`, because `/about` carries the real readable list. It pauses on hover and focus per WCAG 2.2.2 and is static under reduced motion.
- D-092: The hero lede illumination and the stat counters run on the time clock, not a scroll timeline. Both sit above the fold, where a `view()` timeline completes before the user can see it move.
- D-093: The spotlight costs 170 bytes gzipped, against a budget of 8 KB. Worst page total is 6,394 bytes gzipped.
- D-094: `Divider.astro` is reinstated as an inline SVG with a path draw. The error-bar bracket is in DESIGN.md section 4 but had been dropped from every page during the layout rebuild, so item 9 had no target until it was restored.
- D-095: The rejection list is recorded in DESIGN.md section 7 with the test behind it, so the reasoning survives rather than just the verdicts.

## Animation pass three, audit and hover system

- D-096: The `h1` mask reveal moves to the time clock. It was on `view()` with `entry 15%` to `entry 85%`, and the `h1` is above the fold on every page on the site, so the entry range was complete before the first frame and the animation was pinned at its end state. Measured identity transform at 39ms and still identity at 1650ms: it had never run since it was written. `view()` cannot drive anything above the fold and there is no scroller argument to reach for.
- D-097: The `h1` shimmer moves to the time clock, one sweep at `--dur-hero`, against the instruction to bind it to a `view()` range. It was on `scroll(root block)` over the whole 6,093px document, which is the "too slow" complaint: measured, it had not moved at all by 10% scroll and completed only at the very bottom. A `view()` range does not fix it for the reason in D-096. The intent, a sweep that completes in a perceptible span, is met on the time clock.
- D-098: The border beam runs `2.4s linear 3` and stops. It was infinite. A spotlight, not a heartbeat. Hover-only was the alternative and was rejected because it never fires on touch, and the beam's job is to point at the most-worth-reading card unprompted.
- D-099: The skills marquee is the only infinite animation on the site. The scroll progress bar is the only thing bound to the full document length. Both are recorded in an allowlist in `scripts/audit-motion.mjs` so anything else with the same shape is a real finding.
- D-100: Easing follows one rule: entrances ease out, exits ease in, hover and press use `--ease-spring`, scroll-driven stays linear. `--ease-spring` is a `linear()` ramp because `cubic-bezier` cannot return a value above 1 and so cannot overshoot. Verified supported, and verified to fall back to `ease` where it is not.
- D-101: The button beam and the Ken Burns pan are the two hover effects not sprung. Both are traversals at constant speed rather than state changes, and overshoot on a traversal reads as a bug.
- D-102: Card lift, image zoom and image pan use `translate` and `scale` rather than `transform`. Every card is also a reveal target, and an animation with `fill-mode: both` owns the properties it names above any normal declaration, so the lift written as `transform` never appeared.
- D-103: Never put `transform` in the same rule as `scale` or `translate`. Lightning CSS folds the three into one `transform` declaration, which drops the other two. It arrives through `@tailwindcss/vite` regardless of `vite.build.cssMinify`, and it happens with minification off, so there is no setting to disable. Rules with identical selectors are merged first, so separate rules with the same selector are not enough.
- D-104: Hover containers use `:has(:focus-visible)` rather than `:focus-within`, so a keyboard user gets the whole gesture and a mouse user who clicks a link inside a card does not get a hover state stuck on.
- D-105: Skill items stay non-focusable. The instruction that every hover fire on `:focus-visible` cannot be met for them because they are not interactive, and adding forty tab stops of non-interactive content to satisfy a selector would be an accessibility regression.
- D-106: Skill labels rest at `--color-ink-3` and go to `--color-ink` on hover, per the instruction. 4.9:1 passes AA at this size.
- D-107: Nav link hover is an underline growing from the left, not a colour change. The colour change read as the weight changing and made the pill look like it was reflowing when it was not.
- D-108: `@starting-style` with `transition-behavior: allow-discrete` for the mobile nav, and `interpolate-size: allow-keywords` with `::details-content` for the case study rail. Neither changed the JavaScript byte count, because neither replaced JavaScript here: the first replaced a CSS hack, and the rail never had a measuring script. Measured 6,533 bytes gzipped on the worst route before and after, identical on all twelve routes.
- D-109: `interpolate-size` is guarded and never load bearing. The `[open]` rule sets `block-size: auto` unconditionally, so a browser with one feature and not the other gets a panel that snaps open, which is what it did before.
- D-110: The header no longer animates on load and the `hero-nav` class is removed. The rule was dead: Nav.astro's scoped `.site-header` outranks a bare class. The header is persistent chrome under `ClientRouter` and should not fade in on every navigation.
- D-111: `.reveal`, `.reveal-text` and `.reveal-label` are declared and unused, zero occurrences across all twelve built routes. Kept as the documented escape hatch and recorded in DESIGN.md section 7 so they are not read as live.
- D-112: `scripts/audit-motion.mjs` and `scripts/verify-hover.mjs` are added and tracked. The audit reads back resolved values because source order and Astro's scoped-style specificity mean the declaration in the file is not always the one that wins, and none of the pass three bugs were visible in a screenshot.

## Animation pass four, the four live-site defects

- D-113: Every scroll range is expressed in `cover`, never `entry`. An entry range is as long as the element, so a percentage through it lands somewhere different depending on the element's height: measured on the deployed site under `entry 10% entry 70%`, a skill chip finished its reveal with its centre at 96 percent of viewport height and a project row at 47 percent. A cover range is viewport plus element and its midpoint is the element centred, so completion holds between 53 and 71 percent across every route. Verified by `scripts/audit-motion.mjs`, which fails anything outside 45 to 80.
- D-114: Card travel raised from 24px to 40px, and to 64px on the lead element of each section. DESIGN.md capped travel at 32px, which was written for time-based entrances and is wrong for scroll-driven ones where the reader sets the speed.
- D-115: Four reveal vocabularies rather than one: cards rise and scale, list rows alternate sides, prose landmarks rise 28px, body paragraphs rise 16px and finish earlier. Uniform motion normalises within about two sections. This is the same number of animations with more range, not more animations.
- D-116: Prose gets reveals, in two weights, on `.prose` and `.story`. Audited per route rather than assumed: `/notes` and four of the five case studies had no scroll motion at all, while `/papers` and `/teaching` already did. Body paragraphs are included because four of the five case studies contain no headings at all, so a landmarks-only rule would have left them with one animated element each.
- D-117: The sidebar's entry animation is disabled after the first navigation via `data-navigated`, set on `astro:after-swap`. `transition:persist` was working: the node is measurably the same object afterwards. It cannot preserve a CSS animation's progress, because the swap detaches and re-attaches the element, which cancels the animation and restarts it on re-insertion.
- D-118: Comments inside an `is:inline` script ship to every page unminified. A fourteen line explanation cost 426 bytes gzipped per route. Explanations live in CSS, which Lightning CSS strips.
- D-119: The border beam is removed. Its mask composited as `add` rather than `exclude`, so the raw conic gradient painted a large dark wedge across the whole Sieve card instead of a 1px ring. Two causes: Lightning CSS drops the composite keyword from the `mask` shorthand, and `-webkit-mask` is an alias of `mask` in Blink so the prefixed shorthand reset the composite afterwards. Fixed, measured, and then deleted: 0.82 percent of the card's pixels change over a full revolution, all on the perimeter. Three rendering traps and one shipped defect for an effect you notice only if you are looking at the card edge.
- D-120: The user's report that the beam was still infinite was wrong. Measured on the deployed build: iteration count 3, duration 2.4s, zero beam animations running 9 seconds after load. D-098 was already live.
- D-121: `.beam` is renamed `.is-flagship` and survives only as the hook for the Ken Burns pan. `.is-lead` was rejected as the new name because Counter.astro already uses it for a counter's leading digit group.
- D-122: `scripts/verify-motion.mjs` now separates two failures. `stuck` is invisible at maximum scroll, which is always a bug. `late` is invisible while the element's centre is in the top 80 percent of the viewport, the reading zone. The old check flagged any transparent element anywhere in the viewport, which counts an element still entering at the bottom edge as a failure; it only stayed quiet before because entry ranges completed almost immediately for small elements.

## Elevation, and the long-form carve-out

- D-123: Three surface levels ship. Light: recessed `#E1E8E4`, page `#EFF3F1`, raised `#FCFDFC`, hairline `#CFDCD6`. Dark: recessed `#070B0A`, page `#111815`, raised `#1F2B26`, hairline `#33403B`. Before this the page, every card and every container were the identical hex, separated only by a hairline: a measured step of 0.0 L*, which is why the site read as one flat field. Cards, data table panels, the profile sidebar, the nav pill and the stat cells are raised; table header rows, browser chrome bars, inline code and image placeholders are recessed.
- D-124: Steps are 4.1 and 3.7 L* in light, 4.7 and 8.8 in dark. The asymmetry is deliberate. Light has a soft shadow doing half the work of lifting a card; dark has none, because a soft shadow on a dark field is either invisible or a grey halo, so the lightness step and the hairline carry the whole job there.
- D-125: The light ramp is not increased and cannot be. It is boxed between near-white and the point where ink-3 stops passing AA: every surface carrying ink-3 must be L* 92.9 or lighter, leaving about 6.7 L* for two steps. Going further requires darkening ink-3, which merges it into ink-2 and collapses the two secondary tiers. Dark took the full 50 percent increase on page to raised, from 5.8 to 8.8 L*, because dark is where the separation read quietest by eye and where the headroom exists.
- D-126: The earlier proposal's ink-3 of `#5E6863` was rejected on inspection. It sat 2.2 L* above ink-2, which is not a second tier, it is the same colour. Shipped value is `#626C67`, 3.9 L* above ink-2, close to the original design's 5.1 gap.
- D-127: The DESIGN.md ink-3 rule now reads "must not reduce contrast against any surface it sits on, and must stay clear of ink-2", replacing "do not lighten". The direction was never what mattered. A second clause records that ink-3 never sits on the recessed surface, which is why inline `code` pins itself to `--color-ink` rather than inheriting.
- D-128: A soft shadow is allowed on raised surfaces in light mode, reversing the blanket ban. The ban made sense when the page carried a printed grid for cards to sit against; without it the shadow does more work than a second border. Two layers, tinted with the ink colour rather than black. None in dark.
- D-129: Contrast is verified against the rendered DOM by `scripts/verify-contrast.mjs` rather than against a token matrix. A matrix says ink-3 on recessed fails while the site never puts it there, and says nothing about pairs that arise through inheritance. Worst real normal-size pair after elevation, excluding the two known exceptions below: 4.86:1 light (ink-3 on the page) and 4.67:1 dark (ink-3 on raised).
- D-130: Two contrast failures are recorded and deliberately left alone, both predating this work. The ghosted display line is 1.50:1, specified in DESIGN.md section 4 as 18 percent of ink, and unchanged by elevation because it is mixed from the page colour. The `unmeasured` state is 1.91:1 light and 2.37:1 dark: `--color-null` is documented as decorative glyphs only but renders the word `null` at 16px. Elevation moved these from 2.00 and 2.45, too small to matter against a shortfall of two ratio points, so the token was not churned. Both need a call from Kishan.
- D-131: Body paragraphs do not reveal on `/notes` and `/work/sieve`. On a three-paragraph page the reveal reads as the page arriving; on a page read straight through, text fading in fights the reading. The switch is the heading count, set as `is-longform` by CaseStudy.astro when an entry has h2 sections, because that is what actually distinguishes the long pages from the short ones. Measurement blocks join the landmark set so the signature component still moves on every page.
- D-132: The contrast script resolves colours by painting them into a canvas and reading the pixel back. Computed colours are not always `rgb()`: `color-mix()` and `oklab()` serialise in their own space, and a regex over the numbers reads `oklab(0.2 0.01 0.02 / 0.82)` as very nearly black, which produced three confident false failures on the first run.
- D-133: `--color-annot` darkened from `#8A6A1F` to `#816315`. Moving the page down for elevation eroded it from 4.73:1 to 4.51:1, which passes AA by 0.01 and is not a margin. It is now 5.0 on the page, 5.5 on raised and 4.5 on recessed. Found by the DOM contrast audit, not by inspection: it was the worst real pair on the site after elevation and would not have shown up in a token matrix checked against the old paper value.

## Hover everywhere, availability, the keycap and /contact

- D-134: The layered hover and the spotlight apply to every card on the site, not just project cards: capability, paper, teaching, about and contact cards through `.card`, plus stat cells, list rows, skill items and data table panels. A visitor who learns the site answers the pointer and then finds most of it does not was worse than having no hover at all.
- D-135: Lift raised from 3px to 5px, image zoom from 1.06 to 1.09, spotlight radius from 240px to 340px, and the wash from `--color-plot-soft` to a 16 percent mix of `--color-plot` into `--color-raised`. Against the old flat page a soft wash was legible because it was the only thing happening; on the raised surface it was competing with the elevation step and vanished. Rows lift 5px and skill items 3px, because forty items lifting 5px reads as a swarm.
- D-136: One delegated `pointermove` listener on `<main>` replaces one listener per card. At the sizes this now covers that would be about thirty-five listeners on `/about` alone, all computing the same thing. Measured after: 2 listeners on `/about`, one for the spotlight and one for the keycap's own drag, against 35 spotlight surfaces.
- D-137: Cards with no image get the lift, border, spotlight and content shift but not the zoom, which is why the group is a selector list rather than a test for whether an `<img>` is present.
- D-138: The availability line replaces the work-authorization line in CONTENT.md section 9, and lives in `src/data/availability.ts` so the three placements cannot drift. Hero badge takes the short form and links to `/contact`; the footer and `/contact` take the full form. The `/about` work-authorization card is removed rather than updated, since the footer on that same page now carries the full line.
- D-139: `/contact` leads with the email address and the profile links, and puts the form below them. A recruiter is more likely to just email, and the page should not make the form the price of finding an address.
- D-140: Web3Forms, posted client-side. The access key is read at build time from `PUBLIC_WEB3FORMS_KEY` and embedded in the HTML. `PUBLIC_` is the honest prefix: the value has to reach the browser to be posted, and a Web3Forms key only authorises delivery to the single address it was registered with, so it is a routing token rather than a credential.
- D-141: With no key the form is not rendered at all and the page keeps the address, the availability block and the links. A form that posts into nothing is worse than no form, because it looks like a message was sent.
- D-142: On submit failure the status shows the mailto address rather than only an error. Someone who wants to reach him should not be left holding a failure with nowhere to go.
- D-143: The keycap is CSS 3D, no library. Three.js is roughly 150 KB gzipped, more than twenty times the whole site's JavaScript, to draw six quadrilaterals. Built as a real frustum: 120px base, 92px top, walls clipped to trapezoids leaning 16.93 degrees, which is the angle a 14px inset over a 46px rise actually makes.
- D-144: The keycap sits in a recessed well rather than directly on the page. The first version set the front wall to `--color-paper` and it disappeared, because light mode's entire surface range is 91.4 to 99.2 L* with the page at 95.5 in the middle, which is not enough room to shade five faces against the page itself. Giving the object its own recessed backdrop frees the whole raised range for the faces.
- D-145: The keycap's underside is flipped to face outward and backface-culled, so its edge does not show around the base at rest. It is there if the cap is dragged over far enough.
- D-146: `--rx` and `--ry` are registered angle properties, so the settle back to rest after a fling is a CSS transition on `--ease-spring` rather than a spring integrator in JavaScript. The rAF loop only runs while the fling is still decaying.
- D-147: The JS ceiling is 16 KB gzipped on the worst route, up from 10 KB. Worst is `/contact` at 8,037 bytes with 8,347 to spare. Attribution is in DESIGN.md section 9.
- D-148: `site` is `https://kishan-portfolio-three.vercel.app`. `public/robots.txt` hardcoded the old host and is not derived from `site`, so it was corrected by hand; it is the one place a domain change is not automatic.

## Mobile clipping, citations and external links

- D-149: The stat figure was clipped because a viewport clamp cannot know its own column. The grid was already `minmax(0, 1fr)` and the tracks did shrink, measured at 106px each at 390px; the figure inside measured 165px because `--text-stat`'s clamp floor is 40px regardless of the column, and `.stat-value`'s `clip-path`, which exists for the wipe, cut the glyph. The hypothesis that `1fr` refused to shrink was wrong, and `min-width: 0` was added anyway as hygiene rather than as the fix.
- D-150: Stat figures are sized in `cqi` against `.stat-cell`, which becomes a query container. 20cqi, chosen by measuring across widths: 16px of spare width on 182,853 at 320px, and it still reaches 40px at 768px where `--text-stat` caps it.
- D-151: Stats are two columns below 900px and four above, never three. Four stats in three columns leaves an orphan on a second row. Consequence worth stating: at 1440px the figure is 24px where it used to be 70px, because four columns in a 696px content column give a 159px card and a seven-character mono string cannot be 70px in a 159px card. That is the cost of four-up, not a sizing regression.
- D-152: `--text-section` moves from `6.25vw` to `13cqi` against `.shell-main`, for the same reason: at 320px the 42px clamp floor made APPOINTMENTS overflow the 280px column by 22px and the mask `clip-path` cut it. 13cqi fits the longest heading word on the site with room to spare.
- D-153: `.rows` gets `overflow-x: clip`, not `hidden`. The directional slide parks un-revealed even rows at `translateX(40px)`, which pushed the document 20px wider than the viewport at every narrow width. `clip` does not create a scroll container, so `view()` timelines inside still resolve against the document; `hidden` would have frozen every reveal in the list at its start state, which is the trap in D-079. Verified after the change: rows still land at 70, 71 and 67 percent.
- D-154: A horizontal-overflow sweep across all 13 routes at 320, 375 and 390 is a permanent check in `scripts/audit-motion.mjs`. It keys on `documentElement.scrollWidth`, not per-element boxes, because `getBoundingClientRect` reports the layout box whether or not an ancestor clips it; offenders are only listed when nothing above them clips. All 13 routes are clean at all three widths.
- D-155: The contact form posts `FormData` rather than JSON. `Content-Type: application/json` is not CORS-safelisted, so it forces a preflight, and Web3Forms sits behind Cloudflare: a challenged network gets a 403 on `OPTIONS` with no `Access-Control-Allow-Origin` at all, which the browser surfaces only as `TypeError: Failed to fetch`. Multipart is safelisted, so the request is simple and there is one fewer thing to fail. A 15 second abort was added too.
- D-156: The failure state was already a real mailto link, contrary to the report. It has been made more useful rather than merely fixed: the address is monospaced and accented, and a retry button sits beside it.
- D-157: Per-paper citation counts ship, reversing the earlier instruction in CONTENT.md section 6. No total and no h-index: a total of 7 beside a Scholar link displaying 6 is a contradiction a reader can check in one click. Counts live in `src/data/citations.ts` keyed by DOI, mirrored in CONTENT.md, so a refresh is two edits and no code.
- D-158: Green Web 3.0 is recorded as 3 citations though Scholar currently displays 2. It previously displayed 3 and this is a known Scholar indexing fluctuation that usually reverts. Kishan's call, recorded here so nobody "corrects" it later without asking him.
- D-159: External links are rewritten at `astro:build:done` by `src/integrations/external-links.mjs`, not by a component each link has to remember to use. That covers markdown content, which never passes through an Astro component, and any link added later inherits it. 132 links across 13 pages get `target="_blank"`, `rel="noopener noreferrer"` and a visually hidden "(opens in new tab)". Internal links, in-page anchors, mailto and the resume PDF are untouched. "External" is derived from `config.site` rather than hardcoded, so it survives the next domain change.

## The contact form, measured

- D-160: The five-address experiment on the live site returned HTTP 200 with `success: true` for all five, including gmail.com, mit.edu and example.org, and for both a short test message and a long natural one. Web3Forms is neither rejecting nor blocking, so the service was not replaced. Formspree would have been a new dependency and a new manual setup step against a problem the measurement had already ruled out.
- D-161: My earlier diagnosis, that Cloudflare blocks this network, was wrong in an instructive way. The variable was the User-Agent: Playwright's default contains `HeadlessChrome`, which Cloudflare challenges, and the same request with an ordinary Chrome UA is accepted. Any future check against a Cloudflare-fronted API from this environment must set a realistic UA or it will measure the bot challenge instead of the API.
- D-162: Web3Forms uses the field named `email` as the Reply-To by default, confirmed in their documentation. That is the mechanism behind the reported pattern: a submission from an outside address produced mail sent from web3forms.com carrying a Reply-To on an unrelated external domain, which is the shape inbound filters treat as spoofing, while a submission from prajapati.kish@northeastern.edu produced a Reply-To already inside the recipient's own domain and arrived.
- D-163: `replyto` is pinned to the registered address. This reproduces, for every submission, the one configuration already known to arrive. The submitter's address moves into the message body as a field named `Reply to this person at`, which Web3Forms renders as a labelled line, so nothing is lost except the one-click Reply.
- D-164: Delivery itself was not measured and cannot be from here: it needs sight of the inbox. What the experiment establishes is that the API accepts every address, which rules out service rejection and network failure and leaves delivery filtering as the only explanation consistent with the reported pattern. Eight test submissions were sent during the experiment; which of them arrived is the datapoint that settles it.

## The honeypot was the bug

- D-165: The honeypot was a text input with `id="company"` and a visible label reading "Company", which is precisely what browser autofill and password managers target. Autofill wrote a value into it, Web3Forms saw a filled honeypot, and genuine submissions were rejected. Reproduced directly: submitting with `botcheck` set returns HTTP 400 and `{"success":false,...,"message":"Honeypot Error. Botcheck field should be hidden and should be empty"}`.
  It is now a checkbox named `botcheck`, per the Web3Forms spec. A checkbox is right for a second reason beyond not being an autofill target: an unchecked checkbox contributes nothing at all to FormData, so a human's submission carries no `botcheck` key, while the old text input always submitted the key whether or not it held a value. Verified across three addresses: the payload is `access_key, subject, from_name, name, email, message` and nothing else.
  Hardened with `autocomplete="off"`, `tabindex="-1"` and `aria-hidden="true"`, hidden by clipping rather than `display:none`, which some password managers still fill, and clipped rather than pushed to `left: -9999px`, which the overflow sweep in `audit-motion.mjs` would flag. Tab order verified as name, email, message, submit, never the honeypot.
- D-166: The `replyto` pinning from D-163 is reverted. It was a fix for a problem that had not been demonstrated, and it cost the natural behaviour of Reply on a contact form aimed at recruiters: pinned to the registered address, hitting Reply answers Kishan himself. The default is back, so Reply goes to whoever wrote in.
  Re-pin it if, and only if, mail from outside addresses turns out to be filtered on arrival. The evidence for that would be genuine submissions returning HTTP 200 with `success: true` while the email never lands. The change is one hidden input, `<input type="hidden" name="replyto" value="prajapati.kish@northeastern.edu" />`, and D-162 records the mechanism.
- D-167: The three real fields carry `autocomplete="name"`, `autocomplete="email"` and `autocomplete="off"`, so autofill has correct targets and stops guessing at neighbouring inputs. That is part of the honeypot fix rather than a separate nicety: autofill guesses when it cannot find what it is looking for.

## Rollback

- D-168: The honeypot rebuild is rolled back in full. `src/pages/contact.astro` is restored to its state at 686f5ee, which means the original text-input honeypot and the pinned `replyto`. This supersedes D-165, D-166 and D-167, and it is the version that was in place when a submission from someone else arrived successfully.
  The reason is not that the honeypot analysis was wrong. It is that the change removed the form for Kishan, and a contact page with no form is worse than a contact form that rejects some fraction of submissions. One address failing out of several is acceptable; losing the form is not.
  **Do not attempt another honeypot fix.** The record on this specific problem is that every change has cost more than the bug. If the honeypot ever has to be revisited, the evidence to gather first is a real failing submission from a real browser with autofill active, captured with its full request payload, rather than another change made against a reproduction that does not include autofill.

## Primary domain

- D-169: `site` is `https://kishanprajapati.vercel.app`. Changing it moved 54 references in one edit: 13 canonical links, 13 `og:url`, 13 `og:image`, 12 sitemap `<loc>` entries, the sitemap index and the `robots.txt` Sitemap line. `public/robots.txt` again needed doing by hand, as recorded in D-148: it is still the one place a domain is not derived from `site`.
- D-170: **`kishan-portfolio-three.vercel.app` must stay attached to this project as a permanent redirect, and must never be deleted.** That URL is already on job applications that have been submitted. Removing the domain from the Vercel project, or deleting the project it points at, turns a live portfolio link into a 404 on applications Kishan cannot recall or correct. Keep it assigned as an alias so Vercel serves a 308 to the primary domain. This survives any future rename: whatever the primary becomes, every previously published hostname stays attached.
- D-171: The external-link handler in `src/integrations/external-links.mjs` derives "external" from `config.site`, so the domain change was picked up with no edit to it. Verified after the change rather than assumed: 132 external links marked, 194 internal links untouched, none misclassified in either direction, and zero anchors anywhere in the built output point at the old host, which is what would have silently flipped to external. The external hosts are github.com, scholar.google.com, www.linkedin.com, leetcode.com, doi.org and www.itm-conferences.org, all genuinely off-site.
