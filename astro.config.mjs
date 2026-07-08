// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Production URL. Used for the sitemap, canonical links, and
  // Open Graph / Twitter meta tags.
  site: 'https://skydive.lu',

  integrations: [
    sitemap({
      // The root page is a noindex redirect to /en/ - keep it out of the sitemap.
      filter: (page) => page !== 'https://skydive.lu/',
      // Emit hreflang alternate links for every URL in the sitemap.
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', fr: 'fr', de: 'de' },
      },
    }),
  ],

  // Multilingual routing configuration.
  i18n: {
    // The four locales the site supports.
    // Order doesn't matter functionally, but EN first is a useful convention.
    locales: ['en', 'fr', 'de'],

    // The default locale.
    defaultLocale: 'en',

    routing: {
      // Even the default locale gets a /en/ prefix in URLs.
      // Cleaner and avoids weird cases where /about is EN but /fr/about is FR.
      prefixDefaultLocale: true,

      // Root redirect is handled by src/pages/index.astro for static hosts.
      redirectToDefaultLocale: false,
    },

    // NOTE: no `fallback` block here on purpose.
    // In Astro 6, fallback registers redirect routes that compete with
    // the real per-locale files. Alphabetical priority means EN beats FR
    // and silently prevents /fr/* pages from being generated at build time
    // — so every FR page 404s on a static deploy even though the .astro
    // files exist. Since we have all pages in all 4 languages, we don't
    // need fallback at all.
  },
});
