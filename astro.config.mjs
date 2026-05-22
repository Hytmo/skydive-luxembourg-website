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

    // The default locale. If a page is missing in fr or de, Astro can
    // fall back to its English version (see "fallback" below).
    defaultLocale: 'en',

    routing: {
      // Even the default locale gets a /en/ prefix in URLs.
      // Cleaner and avoids weird cases where /about is EN but /fr/about is FR.
      prefixDefaultLocale: true,

      // Visiting / will redirect to /en/.
      redirectToDefaultLocale: true,
    },

    // While we're still building, a missing /fr/tandem will silently
    // serve /en/tandem instead of 404-ing. Once all pages exist in all
    // languages, this fallback never triggers — but it's a safe default.
    fallback: {
      fr: 'en',
      de: 'en',
    },
  },
});