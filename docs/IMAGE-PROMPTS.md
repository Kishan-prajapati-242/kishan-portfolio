# IMAGE-PROMPTS.md

Six generated images, plus instructions for the headshot. Every prompt below is written to be pasted whole, with no editing.

---

## 0. READ THIS FIRST, IT WILL SAVE YOU TIME

**Where to generate, all free.** In order of preference:
1. A Hugging Face Space running FLUX.1-schnell or FLUX.1-dev. You already use HF Spaces, and schnell is fast and free. Search "FLUX.1-schnell" on huggingface.co/spaces and use whichever Space is up.
2. Ideogram, free daily credits, and it is the best of the free options at flat graphic and poster styles.
3. Google's image generation in Gemini, free tier.

**Set the aspect ratio in the interface, not the prompt.** Writing "1600x900" inside a prompt does nothing on most models. Use the tool's aspect-ratio control. Required ratios are stated per image.

**Generate four variations of each and pick one.** Do not accept the first output. These models produce one good result in three or four.

**Honest note about which images actually matter.** Generated abstract art on a project card is decoration. A real screenshot of Sieve's own search results, or the real teaser figure from the paper, would each be worth more than every image in this file combined. If you can produce either, use it instead and skip that prompt. The generated art exists so the `/work` index does not look empty, not because it adds information.

**The site works with zero images.** The `cardArt` field in the schema is optional for exactly this reason. If image generation frustrates you, ship without it and add art later. Do not let this block the launch.

---

## 1. THE STYLE BIBLE

Every one of the six images obeys this. It is already embedded in each prompt below, repeated verbatim, because these models weight repeated instructions more heavily than referenced ones. Do not remove the repetition to make a prompt shorter.

**Medium:** flat two-colour screenprint, in the manner of mid-century technical and scientific printing. Visible fine paper grain. Slight ink-registration imperfection, meaning the two ink layers are misaligned by roughly one to two pixels in a consistent direction, which is what real screenprinting looks like. Absolutely flat colour fills with no gradient inside any shape.

**Palette, exactly three values and no others:**
- paper: a cool off-white, faintly green-shifted, hex `#F6F8F6`
- ink: a very dark desaturated green-black, hex `#16201C`
- accent: a deep pine green, hex `#1B4D42`

**Lighting:** none. This is printed ink on paper photographed flat under even light. No cast shadows, no highlights, no volumetric light, no depth of field, no bokeh.

**Perspective:** strictly orthographic and flat-on. No vanishing point, no isometric skew, no three-quarter view, no 3D rendering.

**Content bans, in every prompt:** no text, no letters, no numbers, no glyphs, no typography, no watermarks, no signatures, no logos, no UI chrome, no browser windows, no people, no faces, no hands, no body parts, no brains, no glowing neon, no circuit-board motifs, no lens flare, no gradient mesh, no glassmorphism, no photorealism.

**Why the bans on brains and circuit boards:** those are the two most common outputs when a model sees the words "AI" or "NLP". They are visual cliché and they will make the site look like a stock template. If a generation contains either, discard it.

---

## 2. OG SOCIAL IMAGE

**Aspect ratio: 1.91:1. Target 1200 by 630.** Save as `public/og-default.png`.
**Filename:** `og-default.png`

This is the image that appears when the site is shared on LinkedIn, Slack, or in a message. It is the single highest-traffic image on the site. Get this one right even if you skip the rest.

```
A flat two-colour screenprint in the manner of mid-century scientific printing, on cool off-white paper with hex value F6F8F6, printed in a very dark desaturated green-black ink with hex value 16201C and a deep pine green accent ink with hex value 1B4D42, and no other colours whatsoever.

Composition, described from the left edge of the frame to the right edge. The background is a faint square grid of thin ruled lines in the pine green ink at very low opacity, exactly like engineering graph paper, with grid squares occupying roughly one twentieth of the frame width, extending edge to edge behind everything else. Sitting on this grid, occupying the horizontal band from twenty percent to eighty percent of the frame width and vertically centred, are four solid vertical bars in the dark green-black ink. The bars are narrow, each roughly one twenty-fifth of the frame width. They are evenly spaced with a gap between bars roughly three times a bar's own width. All four bars are aligned to a single shared baseline at sixty-eight percent of the frame height. Their heights increase from left to right in a curve that flattens: the first bar rises to forty percent of the frame height, the second to twenty-two percent, the third to sixteen percent, the fourth to fourteen percent, measured as distance from the top of the bar to the top of the frame, so that each successive bar is taller than the last but by a diminishing amount.

Rising from the exact top centre of each of the four bars is a single very thin vertical whisker line in the dark green-black ink, roughly one tenth of that bar's height, capped at its upper end by a short horizontal tick, forming the shape of a statistical error bar. The whiskers on the leftmost bar are longest and they shorten progressively left to right, the rightmost being barely a stub.

Behind and to the right of the third bar only, a single hollow circle outlined in the pine green accent ink, with no fill, diameter roughly twice a bar's width, centred on that bar's top edge so the bar passes through the circle.

Wide empty margins of untouched paper on all four sides, at least twelve percent of the frame on each edge. Generous negative space is essential. The overall impression is a hand-plotted measurement on graph paper, quiet and precise.

Flat absolutely uniform colour fills with zero gradient inside any shape. Visible fine paper grain across the whole image. Slight ink registration misalignment of one or two pixels between the two ink layers, consistently in the same direction. No lighting, no cast shadows, no highlights, no depth of field. Strictly orthographic flat-on view with no perspective and no vanishing point.

Negative: no text, no letters, no numbers, no digits, no glyphs, no typography, no labels, no watermark, no signature, no logo, no UI, no browser window, no dashboard, no people, no faces, no hands, no brain imagery, no neural network node diagrams, no circuit boards, no glowing effects, no neon, no lens flare, no gradient mesh, no glassmorphism, no 3D render, no photorealism, no additional colours, no blue, no orange, no purple, no red.
```

---

## 3. SIEVE CARD

**Aspect ratio: 16:9. Target 1600 by 900.** Save as `src/assets/work/sieve.png`.
**Alt text to use in the schema:** `Abstract screenprint of a dense field of small rectangles with one narrow vertical channel selected and several rectangles rendered as hollow outlines.`
**Concept:** retrieval and deduplication. A dense corpus, a narrow selection, and the duplicates removed.

```
A flat two-colour screenprint in the manner of mid-century scientific printing, on cool off-white paper with hex value F6F8F6, printed in a very dark desaturated green-black ink with hex value 16201C and a deep pine green accent ink with hex value 1B4D42, and no other colours whatsoever.

Composition. The entire frame is filled edge to edge with a dense regular field of small solid rectangles in the dark green-black ink, each rectangle in landscape orientation and roughly three times as wide as it is tall, arranged in a strict grid of about twenty-four columns by fourteen rows, with a narrow uniform gutter between rectangles of roughly one quarter of a rectangle's height. The field is mechanically regular, like a page of dense justified type seen from far enough away that the letters are no longer legible.

Cutting vertically through this field, from the top edge of the frame to the bottom edge, is a single narrow channel occupying the width of exactly two adjacent columns, positioned so its left boundary sits at sixty-two percent of the frame width. Inside that channel every rectangle is printed in the deep pine green accent ink instead of the dark green-black, and each of those accent rectangles is shifted three pixels to the right of its column's alignment, so the channel reads as a selected and separated subset. The channel has no border, no outline, and no background tint. It is defined purely by the colour change and the shift.

Scattered across the rest of the field, at eleven irregular positions chosen so that no two are adjacent and none falls inside the channel, individual rectangles are rendered as hollow outlines instead of solid fills: a one pixel dark green-black stroke with untouched paper showing through the middle. These read as items removed from an otherwise complete set.

Flat absolutely uniform colour fills with zero gradient inside any shape. Visible fine paper grain across the whole image. Slight ink registration misalignment of one or two pixels between the two ink layers, consistently in the same direction. No lighting, no cast shadows, no highlights, no depth of field. Strictly orthographic flat-on view with no perspective and no vanishing point.

Negative: no text, no letters, no numbers, no digits, no glyphs, no typography, no readable characters, no watermark, no signature, no logo, no UI, no browser window, no people, no faces, no hands, no brain imagery, no circuit boards, no glowing effects, no neon, no lens flare, no gradient mesh, no glassmorphism, no 3D render, no photorealism, no additional colours, no blue, no orange, no purple, no red.
```

---

## 4. GATEKEEPN'T CARD

**Aspect ratio: 16:9. Target 1600 by 900.** Save as `src/assets/work/gatekeepnt.png`.
**Alt text:** `Abstract screenprint of four measuring rules of different scales aligned beneath one identical shape.`
**Concept:** four corpora, four different reference operations, one shared metric. Four differently calibrated instruments measuring the same object.

```
A flat two-colour screenprint in the manner of mid-century scientific printing, on cool off-white paper with hex value F6F8F6, printed in a very dark desaturated green-black ink with hex value 16201C and a deep pine green accent ink with hex value 1B4D42, and no other colours whatsoever.

Composition, described from the top of the frame downward. In the upper third, horizontally centred, sits a single solid shape in the deep pine green accent ink: a plain rounded-corner rectangle in landscape orientation, occupying thirty percent of the frame width and twelve percent of the frame height, with a corner radius of roughly one eighth of its own height. It is featureless, with no marks, no notches, and no internal detail. This is the object being measured.

Below it, in the lower two thirds of the frame, are four horizontal measuring rules stacked vertically, each one a long thin horizontal line in the dark green-black ink spanning exactly the same width as the shape above and horizontally aligned with it, so all four rules and the shape share identical left and right boundaries. The four rules are evenly spaced vertically with a gap between them of roughly eight percent of the frame height.

Each rule carries a row of short vertical graduation ticks descending from the line, and the four rules are graduated at four visibly different intervals, which is the entire point of the image. The first and topmost rule has ticks at wide intervals, roughly eight ticks across its span, with every tick the same length. The second rule has roughly sixteen ticks. The third has roughly thirty-two ticks, densely packed. The fourth and bottom rule has roughly five ticks, the sparsest of all, and its ticks are twice as long as those on the other three rules. No two rules share a graduation interval.

A single very thin vertical guide line in the pine green accent ink runs from the bottom edge of the measured shape straight down through all four rules to the bottom rule, positioned at forty percent of the shape's width from the shape's left edge, crossing each rule at a point that does not coincide with a graduation tick on any of the four. That is deliberate: the same point reads as a different value on every scale.

Wide empty margins of untouched paper on the left and right, at least fifteen percent of the frame on each side.

Flat absolutely uniform colour fills with zero gradient inside any shape. Visible fine paper grain across the whole image. Slight ink registration misalignment of one or two pixels between the two ink layers, consistently in the same direction. No lighting, no cast shadows, no highlights, no depth of field. Strictly orthographic flat-on view with no perspective and no vanishing point.

Negative: no text, no letters, no numbers, no digits, no glyphs, no typography, no measurement labels, no rulers with printed numerals, no watermark, no signature, no logo, no UI, no people, no faces, no hands, no brain imagery, no circuit boards, no glowing effects, no neon, no lens flare, no gradient mesh, no glassmorphism, no 3D render, no photorealism, no wood grain, no metal texture, no additional colours, no blue, no orange, no purple, no red, no yellow.
```

---

## 5. ATCTM CARD

**Aspect ratio: 16:9. Target 1600 by 900.** Save as `src/assets/work/atctm.png`.
**Alt text:** `Abstract screenprint of a horizontal timeline of dots where one dot emits curved arrows backward to earlier dots.`
**Concept:** the three-tier temporal event memory. A later event retroactively reinterprets earlier statements.

```
A flat two-colour screenprint in the manner of mid-century scientific printing, on cool off-white paper with hex value F6F8F6, printed in a very dark desaturated green-black ink with hex value 16201C and a deep pine green accent ink with hex value 1B4D42, and no other colours whatsoever.

Composition. A single horizontal line in the dark green-black ink runs across the frame at fifty-five percent of the frame height, beginning at twelve percent of the frame width and ending at eighty-eight percent, with a small solid arrowhead at its right end only. This is a timeline.

Sitting on this line are nine solid filled circles in the dark green-black ink, each with a diameter of roughly two percent of the frame width, evenly spaced along the line so the first sits at the line's left end and the ninth at seventy-five percent of the frame width, leaving the segment between the ninth circle and the arrowhead empty.

The seventh circle from the left is different: it is drawn twice the diameter of the others and printed in the deep pine green accent ink, and it is the only accent-coloured element in the lower half of the image.

From that large seventh circle, three thin curved arrows in the pine green accent ink arc backward and to the left, above the timeline. Each arc rises from the top of the seventh circle, curves upward and leftward in a smooth shallow arc that peaks at roughly twenty-five percent of the frame height, then descends to terminate in a small arrowhead touching the top edge of an earlier circle. The three arrows terminate at the second, fourth, and fifth circles respectively. The three arcs do not intersect each other at any point, and each has a different peak height, with the longest arrow arcing highest.

Each of the three earlier circles that receives an arrow is redrawn as a hollow outline rather than a solid fill, with a one pixel dark green-black stroke and untouched paper visible in the centre, so those three read as having been re-opened while the other five remain solid.

Wide empty margins of untouched paper across the bottom third of the frame and along both side edges.

Flat absolutely uniform colour fills with zero gradient inside any shape. Visible fine paper grain across the whole image. Slight ink registration misalignment of one or two pixels between the two ink layers, consistently in the same direction. No lighting, no cast shadows, no highlights, no depth of field. Strictly orthographic flat-on view with no perspective and no vanishing point.

Negative: no text, no letters, no numbers, no digits, no glyphs, no typography, no date labels, no watermark, no signature, no logo, no UI, no people, no faces, no hands, no brain imagery, no neural network layer diagrams, no circuit boards, no clocks, no calendars, no hourglasses, no glowing effects, no neon, no lens flare, no gradient mesh, no glassmorphism, no 3D render, no photorealism, no additional colours, no blue, no orange, no purple, no red.
```

---

## 6. MOODLENS CARD

**Aspect ratio: 16:9. Target 1600 by 900.** Save as `src/assets/work/moodlens.png`.
**Alt text:** `Abstract screenprint of a single line entering a narrow vertical divider and leaving as six parallel lines of different lengths.`
**Concept:** one text input decomposed into six simultaneous classifications.

```
A flat two-colour screenprint in the manner of mid-century scientific printing, on cool off-white paper with hex value F6F8F6, printed in a very dark desaturated green-black ink with hex value 16201C and a deep pine green accent ink with hex value 1B4D42, and no other colours whatsoever.

Composition, described from the left edge to the right edge. Entering from the left, at fifty percent of the frame height, is a single thick horizontal bar in the dark green-black ink. It begins at eight percent of the frame width, extends rightward to thirty-five percent of the frame width, and has a thickness of roughly three percent of the frame height.

At thirty-five percent of the frame width stands a single narrow vertical element in the deep pine green accent ink: a solid rectangle occupying two percent of the frame width and spanning vertically from twenty percent to eighty percent of the frame height. The incoming bar terminates flush against its left face.

Emerging from the right face of that vertical element are six thin horizontal bars in the dark green-black ink, all beginning at exactly thirty-seven percent of the frame width, stacked vertically and evenly spaced across the range from twenty-two percent to seventy-eight percent of the frame height, each with a thickness of roughly one and a half percent of the frame height, which is half the thickness of the incoming bar.

The six outgoing bars are of six clearly different lengths, terminating at the following horizontal positions measured as a percentage of frame width, in order from the topmost bar to the bottom: ninety percent, fifty-two percent, seventy-eight percent, sixty-one percent, eighty-six percent, and forty-six percent. The lengths are deliberately not in ascending or descending order.

At the right end of each of the six bars is a single short vertical tick in the pine green accent ink, the same height as the bar's thickness multiplied by three, centred on the bar's end, functioning as a terminal cap.

Wide empty margins of untouched paper on all four sides, at least ten percent of the frame on each edge.

Flat absolutely uniform colour fills with zero gradient inside any shape. Visible fine paper grain across the whole image. Slight ink registration misalignment of one or two pixels between the two ink layers, consistently in the same direction. No lighting, no cast shadows, no highlights, no depth of field. Strictly orthographic flat-on view with no perspective and no vanishing point.

Negative: no text, no letters, no numbers, no digits, no glyphs, no typography, no bar chart labels, no axis labels, no watermark, no signature, no logo, no UI, no dashboard, no people, no faces, no hands, no emoji, no emoticons, no smiley faces, no facial expressions, no brain imagery, no circuit boards, no prisms with rainbow light, no rainbow, no spectrum, no glowing effects, no neon, no lens flare, no gradient mesh, no glassmorphism, no 3D render, no photorealism, no additional colours, no blue, no orange, no purple, no red, no yellow.
```

The rainbow and prism bans matter. "One input becoming six outputs" makes most models produce a glass prism splitting white light, which would be both a cliché and off-palette.

---

## 7. MOODINSIGHT CARD

**Aspect ratio: 16:9. Target 1600 by 900.** Save as `src/assets/work/moodinsight.png`.
**Alt text:** `Abstract screenprint of a sparse network of dots and connecting lines, with a small cluster of filled dots among mostly hollow ones.`
**Concept:** social media graph analysis. Sparse signal in a large graph.

```
A flat two-colour screenprint in the manner of mid-century scientific printing, on cool off-white paper with hex value F6F8F6, printed in a very dark desaturated green-black ink with hex value 16201C and a deep pine green accent ink with hex value 1B4D42, and no other colours whatsoever.

Composition. A sparse irregular network occupies the central seventy percent of the frame, leaving at least fifteen percent of untouched paper margin on every edge. The network consists of thirty-two circles, each with a diameter of roughly one and a half percent of the frame width, scattered at irregular positions with visibly uneven local density, so that some regions of the frame hold four or five circles close together while other regions hold one or none. The scatter must look organic and hand-placed, not gridded, not radially symmetrical, and not evenly distributed.

Twenty-six of the thirty-two circles are hollow outlines: a one pixel dark green-black stroke with untouched paper visible inside. The remaining six are solid filled circles in the deep pine green accent ink, and those six are clustered together in one loose group positioned in the lower right quadrant of the network, at roughly sixty-five percent of the frame width and sixty-five percent of the frame height. No solid circle appears anywhere else in the frame.

Connecting the circles are forty-one straight thin lines in the dark green-black ink, one pixel wide, each line running between the edges of two circles and never passing through the interior of a third. The connection pattern is uneven: several circles have five or six lines meeting at them while at least four circles have exactly one line, and two circles have none at all and stand isolated. Lines are permitted to cross each other. No line has an arrowhead. The network is undirected.

The six solid accent circles in the lower right are more densely interconnected with each other than the rest of the graph is, so that cluster reads as tighter than its surroundings.

Flat absolutely uniform colour fills with zero gradient inside any shape. Visible fine paper grain across the whole image. Slight ink registration misalignment of one or two pixels between the two ink layers, consistently in the same direction. No lighting, no cast shadows, no highlights, no depth of field. Strictly orthographic flat-on view with no perspective and no vanishing point.

Negative: no text, no letters, no numbers, no digits, no glyphs, no typography, no node labels, no watermark, no signature, no logo, no UI, no social media icons, no bird logos, no app icons, no people, no faces, no hands, no avatars, no profile pictures, no brain imagery, no circuit boards, no glowing effects, no neon, no lens flare, no gradient mesh, no glassmorphism, no 3D render, no photorealism, no additional colours, no blue, no orange, no purple, no red.
```

---

## 8. THE HEADSHOT

**Do not run your photo through an image model.** Do not restyle it, do not upscale it with AI, do not put it in an illustrated frame, do not generate a cartoon or a "professional AI headshot" from it. A visibly AI-altered face on an engineer's portfolio reads badly and it will be noticed. The photo you have is a clean studio portrait against a neutral grey background, which is exactly right.

Two steps, both using tools already on your Mac.

**Step 1, crop it to a square.** Your source is landscape. `sips` crops from the centre by default, and your face is close enough to centre that a centre crop works. In Terminal:

```bash
cd ~/dev/kishan-portfolio
mkdir -p src/assets
sips -c 1024 1024 ~/Desktop/Linkedin-profile.png --out src/assets/headshot.png
```

Adjust the source path to wherever the file actually is. `-c` takes height then width, in that order.

**Step 2, check it.** Open `src/assets/headshot.png` in Preview. If the crop cut into your shoulders awkwardly or the framing is off centre, redo it with an offset:

```bash
sips -c 1024 1024 --cropOffset 0 40 ~/Desktop/Linkedin-profile.png --out src/assets/headshot.png
```

`--cropOffset` takes a vertical then horizontal pixel offset from centre. Positive vertical moves the crop window down. Try 40, then adjust.

**That is all.** Do not convert to WebP by hand. Astro's `astro:assets` will generate WebP and AVIF at the right sizes, set the width and height attributes to prevent layout shift, and lazy load it. Import it as a module in the component, do not put it in `public/`:

```astro
---
import { Image } from 'astro:assets';
import headshot from '../assets/headshot.png';
---
<Image src={headshot} alt="Kishan Prajapati" width={140} height={140} loading="eager" />
```

Per DESIGN.md, it renders at 140px, square, with a 1px `--color-ink` border, no rounding, no circle crop, offset to the right of the lede on wide screens.

**Optional, only if the grey studio background bothers you against the site's cool paper colour:** run the file through remove.bg's free tier, then place the cutout on the paper colour. This is genuinely optional. The grey background is fine and matching it perfectly is not worth an hour.

---

## 9. AFTER GENERATION, THE CHECKLIST

Reject any output that has any of these. Regenerate, do not accept and move on.

- [ ] Any text, letter, number, or character-like mark anywhere in the frame, including in the grain
- [ ] Any colour outside the three specified hex values, including a fourth colour appearing only in the paper grain
- [ ] A gradient inside any shape
- [ ] A cast shadow or a highlight
- [ ] A brain, a circuit board, a glowing node network, a prism with rainbow light, or a smiley face
- [ ] A human figure, face, hand, or silhouette
- [ ] Any 3D or perspective rendering
- [ ] Margins tighter than specified, so the composition feels cramped
- [ ] A composition that is radially symmetrical when the prompt asked for irregular scatter

Then optimise before committing. These are decorative images and they should not weigh anything:

```bash
# once, if you do not have it
/opt/homebrew/bin/brew install oxipng

# then, from the repo root
oxipng -o 4 --strip safe src/assets/work/*.png public/og-default.png
```

Target under 150 KB per project card and under 200 KB for the OG image. If a file is larger than that after `oxipng`, the image has too much grain detail. Regenerate with less grain rather than shipping it.
