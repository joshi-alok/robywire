// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://robywire.com',
  integrations: [mdx(), sitemap()],
  image: {
    // Hero images are hotlinked, never committed to the repo.
    domains: ['images.unsplash.com'],
    remotePatterns: [{ protocol: 'https' }],
  },
});
