// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Production URL. Used for the sitemap (added later), canonical
  // links, and Open Graph / Twitter meta tags. Even though we're not
  // live on this domain yet, configuring it now avoids rework.
  site: 'https://skydive.lu',

  // Multilingual routing configuration.
  i18n: {
    // The three locales the site supports.
    // Order doesn't matter functionally, but EN first is a useful convention.
    locales: ['en', 'fr', 'de'],

    // The default locale.
    defaultLocale: 'en',

    routing: {
      // Even the default locale gets a /en/ prefix in URLs.
      // Cleaner and avoids weird cases where /about is EN but /fr/about is FR.
      prefixDefaultLocale: true,

      // Visiting / will redirect to /en/.
      redirectToDefaultLocale: true,
    },

    // NOTE: no `fallback` block here on purpose.
    // In Astro 6, fallback registers redirect routes that compete with
    // the real per-locale files. Alphabetical priority means EN beats FR
    // and silently prevents /fr/* pages from being generated at build time
    // — so every FR page 404s on a static deploy even though the .astro
    // files exist. Since we have all pages in all 3 languages, we don't
    // need fallback at all.
  },
});
