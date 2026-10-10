import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Content Layer API: this file must stay at src/content.config.ts.
const work = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/work' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        subtitle: z.string(),
        order: z.number(),
        // Optional so an entry with no recorded date shows no row rather than an invented one.
        timeline: z.string().optional(),
        team: z.string().optional(),
        status: z.enum(['shipped', 'live', 'under review', 'ongoing', 'archived']),
        repo: z.url().optional(),
        repoPrivate: z.boolean().default(false),
        demo: z.url().optional(),
        demoNote: z.string().optional(),
        stack: z.array(z.string()).min(1),
        cardArt: image().optional(),
        cardArtAlt: z.string().optional(),
        hardware: z.string().optional(),
        summary: z.string().max(260),
        draft: z.boolean().default(false),
      })
      .refine((d) => !d.cardArt || !!d.cardArtAlt, {
        message: 'cardArt requires cardArtAlt',
      })
      .refine((d) => !d.demoNote || !!d.demo, {
        message: 'demoNote requires demo',
      }),
});

export const collections = { work };
