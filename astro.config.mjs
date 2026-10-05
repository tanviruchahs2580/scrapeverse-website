// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export const SITE_URL = 'https://scrapeverse.com';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,

  // Astro 7 changed the default from `true` to `'jsx'`, which strips whitespace
  // between inline elements and breaks Bengali/English text runs. Opt back in.
  compressHTML: true,

  trailingSlash: 'always',
  build: {
    // Keep the output inspectable for Lighthouse/axe budget audits in CI.
    assets: '_assets',
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'bd'],
    routing: {
      // English lives at the root (/), Bangla under /bd/.
      prefixDefaultLocale: false,
      fallbackType: 'rewrite',
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', bd: 'bn-BD' },
      },
      // `/thanks/` is noindex (it is a post-submit target, not content) and
      // `/404/` is already excluded. Keep both out of the sitemap so the two
      // signals do not contradict each other.
      filter: (page) => !page.includes('/thanks/'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
  },
});
