// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://searchoc.org',
  server: {
    port: 4321,
    host: true
  },
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});