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
    plugins: [tailwindcss()]
  },

  integrations: [sitemap(), mdx()]
});