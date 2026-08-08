// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // Every canonical, og:url, og:image and sitemap entry is derived from this.
  site: 'https://kishan-portfolio-three.vercel.app',

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