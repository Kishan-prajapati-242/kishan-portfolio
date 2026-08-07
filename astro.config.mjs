// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // Placeholder domain so @astrojs/sitemap can build. Phase 6 corrects this
  // once the real Vercel domain exists.
  site: 'https://kishan-prajapati.vercel.app',

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Lightning CSS folds `animation-timeline` into the `animation`
      // shorthand, producing `animation: linear both reveal-up view()`. That
      // is valid CSS Animations Level 2 and no browser implements it, so the
      // whole declaration is dropped and every scroll reveal stays stuck in
      // its start state. esbuild leaves the longhand alone.
      cssMinify: 'esbuild',
    },
  },

  integrations: [sitemap(), mdx()]
});