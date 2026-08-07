import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// SPEC.md section 4. This file lives at src/content.config.ts, not
// src/content/config.ts: the old location and the old `type: 'content'`
// property were replaced by the Content Layer API in Astro 5 and this
// project is on 7.1.6.
//
// The schema is a build-time guard, so it is strict. A case study that is
// missing a field fails the build rather than rendering a gap.

const work = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/work' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        subtitle: z.string(),
        order: z.number(), // display order on /work
        // timeline and team are optional against SPEC.md section 4, which
        // requires both. CONTENT.md states neither for MoodLens or
        // MoodInsight, and rule 1 outranks schema strictness: an omitted row
        // is correct where an inferred date would be invention.
        timeline: z.string().optional(), // "July 2026, roughly 8 working days"
        team: z.string().optional(), // "solo" | "4 authors"
        status: z.enum(['shipped', 'live', 'under review', 'ongoing', 'archived']),
        // SPEC.md section 4 writes these as z.string().url(), which the Zod
        // version bundled with Astro 7 deprecates in favour of z.url().
        // Same validation, current API, no check hints.
        repo: z.url().optional(),
        repoPrivate: z.boolean().default(false),
        demo: z.url().optional(),
        stack: z.array(z.string()).min(1),
        cardArt: image().optional(),
        cardArtAlt: z.string().optional(),
        // The hardware line for the case study rail's persistent "measured on"
        // note, required by SPEC.md section 4's layout description. Optional
        // because not every entry is a measured system.
        hardware: z.string().optional(),
        summary: z.string().max(260), // used on /work and in meta description, D-066
        draft: z.boolean().default(false),
      })
      .refine((d) => !d.cardArt || !!d.cardArtAlt, {
        message: 'cardArt requires cardArtAlt',
      }),
});

export const collections = { work };
