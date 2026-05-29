# Skydive Luxembourg Website Rebuild Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Replace the old WordPress/CPL-era public site with a fast, secure, multilingual Astro site that makes Skydive Luxembourg look trustworthy, current, and easy to book.

**Architecture:** Use the existing Astro project in `/home/hytmo/github/skydive-luxembourg-website` as the rebuild base. Keep it static-first, multilingual (`/en`, `/fr`, `/de`), content-light, image-rich, and conversion-focused. External booking remains on DZ-Cloud for now, but the website must clearly frame it as the official booking system.

**Tech Stack:** Astro 6, static build, CSS components/tokens, local optimized images, multilingual static pages, optional lightweight forms integration later.

---

## Current situation summary

Old live site findings:
- `https://www.skydive.lu` redirects to `https://www.cerclepara.lu`.
- Server exposes very old stack: PHP 5.6, OpenSSL 1.0.1, Apache 2.4.29, old Contact Form 7.
- Missing security headers.
- Empty `/a-propos/` page returns HTTP 200.
- Broken menu links: `?page_id=48`, `?page_id=1590`.
- Contact page contains placeholder text.
- Homepage has outdated/inconsistent years and old CPL-era content.
- Missing SEO/accessibility basics: viewport, H1s, descriptions, alt text.
- Tandem page has raw booking links and repeated language blocks.
- Booking goes to external DZ-Cloud domain without enough trust reassurance.

Existing rebuild repo findings:
- Repo exists at `/home/hytmo/github/skydive-luxembourg-website`.
- Astro project already has multilingual page structure under `src/pages/{en,fr,de}`.
- Existing components include Nav, Footer, Layout, Hero, CTABanner, FAQList, PriceCards, ContactForm, etc.
- `Layout.astro` already has viewport, meta description, canonical, hreflang, OG tags, favicon link, and skip link.
- This repo is a good rebuild base.

---

## Success criteria

Launch candidate must meet these before replacing the old site:

1. `npm run build` passes.
2. Every public page has one clear H1.
3. Every page has a unique title and meta description.
4. Navigation works in EN/FR/DE on desktop and mobile.
5. Tandem booking CTA is visible above the fold and before every major decision point.
6. DZ-Cloud handoff clearly says it is the official Skydive Luxembourg booking system.
7. Contact page has no placeholder content and includes privacy/GDPR wording.
8. Legal pages exist: imprint, privacy, cookies.
9. Redirect map from old URLs to new URLs is ready.
10. Lighthouse targets: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+.
11. No public deployment or DNS switch happens without explicit Fränz approval.

---

## Proposed site map

Primary language default:
- `/en/`
- `/fr/`
- `/de/`

Core pages per language:
- Home: `/en/`, `/fr/`, `/de/`
- Tandem: `/en/tandem`, `/fr/tandem`, `/de/tandem`
- AFF / Learn to skydive: `/en/aff`, `/fr/aff`, `/de/aff`
- Experienced skydivers: `/en/fun-jumpers`, `/fr/fun-jumpers`, `/de/fun-jumpers`
- Pricing: `/en/pricing`, `/fr/pricing`, `/de/pricing`
- Gallery: `/en/gallery`, `/fr/gallery`, `/de/gallery`
- FAQ: `/en/faq`, `/fr/faq`, `/de/faq`
- About: `/en/about`, `/fr/about`, `/de/about`
- Contact: `/en/contact`, `/fr/contact`, `/de/contact`
- Legal: imprint, privacy, cookies
- 404 page

Homepage priorities:
1. Immediate identity: Skydive Luxembourg a.s.b.l.
2. Primary CTA: Book a tandem.
3. Secondary CTA: Learn to skydive / AFF.
4. Trust: only skydiving club in Luxembourg, since 1965, qualified instructors, official booking.
5. Clear cards: Tandem, AFF, Fun jumpers.
6. Current season/events teaser.
7. Gallery preview.
8. Final CTA.

---

## Content rules

Tone:
- Clear, modern, trustworthy.
- Sporty but not childish.
- Avoid over-hype where safety matters.
- For aviation/safety/regulatory wording, use official phrasing or mark for review.

Branding:
- Public brand: Skydive Luxembourg / SDL.
- Old CPL/Cercle Para references only in history/about context.
- Avoid `cerclepara.lu` emails in public copy unless still intentionally used.

Languages:
- Full pages in English, French, German.
- Do not stack all languages on one page.
- Use hreflang alternates.
- Consider English as x-default unless club decides otherwise.

Booking wording:
- Make clear that DZ-Cloud is external but official.
- Suggested handoff copy:
  “You are leaving skydive.lu for our official booking system operated by DZ-Manager.”

---

## Task 1: Baseline project health check

**Objective:** Confirm the current Astro rebuild builds cleanly before changing anything.

**Files:**
- Read: `package.json`
- Read: `src/layouts/Layout.astro`
- Read: `src/pages/**/*.astro`

**Steps:**
1. Run `npm install` if dependencies are missing.
2. Run `npm run build`.
3. Record build warnings/errors.
4. Fix only build blockers, not design/content issues.
5. Run `npm run build` again.

**Verification:**
- Build exits 0.
- `dist/` is generated.

**Commit message:**
- `chore: verify Astro rebuild baseline`

---

## Task 2: Replace starter README

**Objective:** Replace the default Astro README with project-specific documentation.

**Files:**
- Modify: `README.md`

**Content to include:**
- Project purpose.
- Local commands.
- Page structure.
- “Do not deploy without SDL approval.”
- Content workflow.
- DNS/redirect notes TBD.

**Verification:**
- README no longer says “Astro Starter Kit”.

**Commit message:**
- `docs: add Skydive Luxembourg project README`

---

## Task 3: Define launch redirect map

**Objective:** Prevent SEO/user breakage when replacing the old site.

**Files:**
- Create: `docs/redirect-map.md`

**Old to new redirects:**
- `https://www.skydive.lu/` -> `https://www.skydive.lu/en/` or chosen default locale.
- `https://www.cerclepara.lu/` -> `https://www.skydive.lu/en/` or chosen default locale.
- `/tandem-jumps/` -> `/en/tandem` plus language-specific alternatives if possible.
- `/skydivers/` -> `/en/fun-jumpers`.
- `/skydivers/information/` -> `/en/fun-jumpers`.
- `/skydivers/prix/` -> `/en/pricing`.
- `/skydivers/rigs/` -> `/en/fun-jumpers` or a future rigs section.
- `/galerie/` -> `/en/gallery`.
- `/contact-2/` -> `/en/contact`.
- `/a-propos/` -> `/en/about`.
- `/a-propos/calendrier/` -> relevant home/events section or `/en/fun-jumpers`.
- `/tandem-jumps/declaration-de-confidentialite-rgpd/` -> `/en/privacy` or `/fr/privacy`.
- `/tandem-jumps/reservation-step-one/` -> `/en/tandem` or direct DZ-Cloud only if approved.

**Verification:**
- Every URL from the old sitemap has a proposed destination.

**Commit message:**
- `docs: add launch redirect map`

---

## Task 4: Finalize navigation IA

**Objective:** Make the nav conversion-focused and not overcrowded.

**Files:**
- Modify: `src/components/Nav.astro`

**Recommended desktop nav:**
- Tandem
- AFF
- Fun jumpers
- Pricing
- Gallery
- FAQ
- Contact
- Primary button: Book now

**Notes:**
- Consider moving “About” to footer if nav is too crowded.
- Keep mobile hamburger.
- Add obvious active state.

**Verification:**
- Desktop nav does not wrap awkwardly.
- Mobile nav opens/closes.
- Book CTA visible from all pages.

**Commit message:**
- `feat: refine main navigation and booking CTA`

---

## Task 5: Homepage rebuild pass

**Objective:** Make the homepage current, trustworthy, and conversion-focused.

**Files:**
- Modify: `src/components/pages/HomeContent.astro`
- Maybe modify: `src/components/sections/Hero.astro`
- Maybe modify: `src/components/sections/FeatureCards.astro`

**Homepage structure:**
1. Hero with strong skydiving image.
2. H1: “Skydive Luxembourg” plus language-specific subtitle.
3. Primary CTA: Book a tandem.
4. Secondary CTA: Learn to skydive.
5. Trust strip: Since 1965 / non-profit club / Luxembourg’s skydiving home / qualified instructors.
6. Three cards: Tandem, AFF, Fun jumpers.
7. Current season block.
8. Gallery preview.
9. Final CTA.

**Content checks:**
- No “58 years”.
- Use “since 1965” instead of a year count where possible.
- No outdated 2015 anniversary copy on homepage.

**Verification:**
- One H1.
- Above fold has clear CTA.
- EN/FR/DE all render.

**Commit message:**
- `feat: rebuild homepage content and conversion flow`

---

## Task 6: Tandem page rebuild pass

**Objective:** Turn Tandem into a real sales/booking page, not a text dump.

**Files:**
- Modify: `src/components/pages/TandemContent.astro`
- Maybe modify: `src/components/sections/PriceCards.astro`
- Maybe modify/create: `src/components/sections/TrustPanel.astro`

**Page structure:**
1. H1: Tandem skydive in Luxembourg.
2. Hero CTA: Book now.
3. Quick facts card:
   - No experience required.
   - Briefing before jump.
   - Exit altitude 4,000 m if still accurate.
   - Freefall around 200 km/h if still approved wording.
   - Parachute flight 5–7 min if still accurate.
   - Price/package summary.
4. What is included.
5. Restrictions.
6. Weather/rescheduling/gift voucher validity.
7. Booking CTA with DZ-Cloud trust note.
8. FAQ teaser.
9. Final CTA.

**Important:**
- Confirm exact package wording before launch: video/photos/T-shirt/price.
- Confirm restrictions: max weight, min height, min age, medical/pregnancy/scuba/alcohol wording.

**Verification:**
- Booking CTA visible near top.
- No raw `--> BOOK NOW <--` style text.
- External booking link opens correct DZ-Cloud URL.
- EN/FR/DE content equivalent.

**Commit message:**
- `feat: rebuild tandem booking page`

---

## Task 7: Booking handoff component

**Objective:** Reassure users before sending them to DZ-Cloud.

**Files:**
- Create: `src/components/BookingHandoff.astro`
- Use in: `TandemContent.astro`, `PricingContent.astro`, maybe `HomeContent.astro`

**Component content:**
- Official booking system note.
- External domain notice.
- Secure payment/rescheduling note if confirmed.
- Button to `https://cpl.dz-cloud.com/Booking/s1_Options`.

**Verification:**
- Link URL is correct.
- Link text is descriptive.
- Component appears wherever users are asked to book.

**Commit message:**
- `feat: add official booking handoff component`

---

## Task 8: AFF page rebuild pass

**Objective:** Make AFF understandable for new students and serious candidates.

**Files:**
- Modify: `src/components/pages/AFFContent.astro`
- Maybe modify: `src/components/AFFForm.astro`

**Page structure:**
1. H1: Learn to skydive with AFF.
2. Short explanation of AFF.
3. Who it is for.
4. Course flow.
5. Requirements.
6. Current/planned course dates.
7. Price or “contact us for current course details”.
8. Contact/interest form.
9. FAQ.

**Needs review by club:**
- Exact AFF dates.
- Licensing wording.
- Medical/regulatory requirements.
- Pricing.

**Verification:**
- No promises that instructors cannot guarantee.
- CTA clearly goes to interest/contact flow.

**Commit message:**
- `feat: rebuild AFF course page`

---

## Task 9: Fun jumpers page rebuild pass

**Objective:** Give licensed skydivers the operational info they need.

**Files:**
- Modify: `src/components/pages/FunJumpersContent.astro`

**Content sections:**
- Welcome licensed skydivers.
- Aircraft/dropzone basics.
- Manifest process.
- Documents/licence/insurance requirements.
- Prices or link to pricing.
- Opening season / calendar note.
- Contact before visiting.
- Rules/safety note.

**Needs review by club:**
- Aircraft details.
- DZ location wording.
- Accepted licenses/insurance.
- Manifest requirements.

**Verification:**
- A visiting jumper knows what to bring and who to contact.

**Commit message:**
- `feat: rebuild fun jumper information page`

---

## Task 10: Pricing page cleanup

**Objective:** Make prices easy to understand and maintain.

**Files:**
- Modify: `src/components/pages/PricingContent.astro`
- Modify: `src/components/sections/PriceCards.astro` if needed

**Sections:**
- Tandem package.
- Optional extras.
- AFF pricing.
- Fun jumper jump tickets.
- Validity/refund/weather notes.

**Needs review by club:**
- Every price.
- Whether prices include VAT or if VAT is not applicable.
- Payment method details.

**Verification:**
- No ambiguous “video included?” issue.
- Pricing is identical across EN/FR/DE except language.

**Commit message:**
- `feat: clarify pricing page`

---

## Task 11: Contact page cleanup

**Objective:** Make contact reliable, accessible, and GDPR-safe.

**Files:**
- Modify: `src/components/pages/ContactContent.astro`
- Modify: `src/components/ContactForm.astro`

**Must include:**
- No placeholder/test text.
- Club name and postal address.
- Correct email.
- Correct phone, if public.
- Visible labels for every form field.
- Required indicators.
- Privacy note near submit.
- Link to privacy page.

**Form decision needed:**
- Static form backend? Email link only? Existing form service?
- Do not silently invent a backend.

**Verification:**
- Keyboard can tab through form.
- Empty submit gives useful visible feedback if form is functional.
- GDPR wording visible before submission.

**Commit message:**
- `feat: rebuild contact page and privacy-safe form`

---

## Task 12: Legal pages review

**Objective:** Ensure basic Luxembourg/EU public site legal pages exist.

**Files:**
- Modify: `src/components/pages/ImprintContent.astro`
- Modify: `src/components/pages/PrivacyContent.astro`
- Modify: `src/components/pages/CookiesContent.astro`

**Needs human/legal review:**
- Official association name.
- RCS/FAL details if relevant.
- Responsible person/contact.
- Hosting provider.
- Analytics/cookies, if any.
- Form data handling.
- DZ-Cloud external processor/controller relationship.

**Verification:**
- Footer links to legal pages.
- Legal pages exist in EN/FR/DE or at least official language approved by club.

**Commit message:**
- `docs: update legal and privacy pages`

---

## Task 13: Image and asset audit

**Objective:** Ensure images are good quality, optimized, and legally usable.

**Files:**
- Review: `src/assets/img/*`
- Modify: all components rendering images
- Create: `docs/image-inventory.md`

**Inventory fields:**
- File name.
- Where used.
- Photographer/source.
- Consent/usage status.
- Alt text.
- Replace/keep decision.

**Verification:**
- No unapproved personal/member imagery used without permission.
- All meaningful images have alt text.
- Hero images look good on mobile and desktop.

**Commit message:**
- `docs: add image inventory and alt text review`

---

## Task 14: SEO metadata pass

**Objective:** Give every page strong search/social metadata.

**Files:**
- Modify page files under `src/pages/{en,fr,de}/*.astro`
- Modify: `src/layouts/Layout.astro` only if needed

**Per page:**
- Unique title.
- Unique description.
- Canonical URL.
- Hreflang alternates.
- OG title/description/image.

**Verification:**
- Inspect built HTML in `dist/`.
- No duplicate generic titles except intentional.

**Commit message:**
- `feat: complete SEO metadata across pages`

---

## Task 15: Accessibility pass

**Objective:** Avoid repeating old site accessibility mistakes.

**Files:**
- Modify as needed across components.

**Checklist:**
- One H1 per page.
- Logical heading order.
- Visible focus styles.
- Skip link works.
- Buttons are buttons, links are links.
- Images have alt text.
- Forms have labels.
- Color contrast passes.
- Mobile menu has correct ARIA.

**Verification:**
- Run Lighthouse.
- Manual keyboard test: Tab through nav, language switcher, forms, CTA buttons.

**Commit message:**
- `fix: improve accessibility across site`

---

## Task 16: Performance pass

**Objective:** Keep the static site fast.

**Files:**
- Optimize images/components as needed.

**Checklist:**
- Avoid huge hero images.
- Use Astro image optimization where already supported.
- Lazy-load below-fold gallery images.
- Avoid unnecessary JavaScript.
- Ensure no broken external scripts.

**Verification:**
- Lighthouse performance 90+ on mobile.
- No 404 resources in Network tab.

**Commit message:**
- `perf: optimize images and remove unused assets`

---

## Task 17: 404 and old URL safety

**Objective:** Make wrong/old links useful.

**Files:**
- Modify: `src/pages/404.astro`
- Use redirect docs from Task 3 in deployment config later.

**404 page should include:**
- Clear message.
- Links to Tandem, AFF, Contact, Home.
- Language fallback if feasible.

**Verification:**
- Unknown route shows useful 404 in preview.

**Commit message:**
- `feat: improve 404 page`

---

## Task 18: Deployment plan

**Objective:** Prepare launch without touching DNS prematurely.

**Files:**
- Create: `docs/deployment-plan.md`

**Must cover:**
- Hosting target: Netlify/Vercel/static host/club server TBD.
- Environment variables if form/backend used.
- Build command: `npm run build`.
- Publish directory: `dist`.
- Security headers configuration.
- Redirect configuration.
- DNS switch plan.
- Rollback plan.

**Important:**
- No DNS switch without explicit approval.
- No public deployment without explicit approval.

**Commit message:**
- `docs: add deployment and rollback plan`

---

## Task 19: Pre-launch QA

**Objective:** Verify launch candidate like a real user.

**Checklist:**
- Desktop Chrome/Firefox/Safari if available.
- Mobile width checks.
- EN/FR/DE navigation.
- Booking handoff links.
- Contact form or contact mail links.
- Legal links.
- Image loading.
- Lighthouse.
- Broken link crawl.
- 404 page.
- Redirect map complete.

**Commands:**
- `npm run build`
- `npm run preview`
- Use browser audit manually.

**Verification:**
- QA notes saved to `docs/prelaunch-qa.md`.

**Commit message:**
- `test: add prelaunch QA results`

---

## Task 20: Launch checklist

**Objective:** Execute launch safely after approval.

**Files:**
- Create: `docs/launch-checklist.md`

**Checklist:**
1. Club approves final copy.
2. Club approves images.
3. Club approves legal pages.
4. Club approves prices and dates.
5. Build passes.
6. Redirects configured.
7. Security headers configured.
8. DNS TTL lowered if needed.
9. Backup/rollback path confirmed.
10. Switch canonical domain to `skydive.lu`.
11. Verify `www.skydive.lu` and apex domain.
12. Verify `cerclepara.lu` redirects.
13. Submit sitemap to Google Search Console if available.
14. Monitor errors for 48 hours.

**Commit message:**
- `docs: add launch checklist`

---

## Open decisions for Fränz / club

1. Default language: English, French, or browser redirect?
2. Canonical domain: `https://www.skydive.lu` or `https://skydive.lu`?
3. Keep `cerclepara.lu` only as redirect?
4. Public email: `mail@skydive.lu` or another address?
5. Public phone number: keep current number or remove?
6. Exact tandem price and what it includes.
7. Exact AFF dates/prices/requirements.
8. Exact fun jumper rules/prices.
9. Which photos are approved for public use?
10. Preferred hosting provider.
11. Form handling: contact form backend or mailto/contact link only?
12. Whether to use analytics; if yes, privacy-friendly analytics preferred.

---

## Recommended execution order

Fastest path to a respectable launch candidate:

1. Baseline build.
2. README and redirect map.
3. Nav + homepage.
4. Tandem page + booking handoff.
5. Contact page.
6. Legal pages.
7. Pricing/AFF/fun jumpers.
8. SEO/accessibility/performance passes.
9. Deployment plan.
10. Pre-launch QA.
11. Approval.
12. Launch.

---

## Non-goals for first launch

Avoid scope creep:
- No member portal.
- No custom booking engine.
- No online payments outside DZ-Cloud.
- No complex CMS unless the club explicitly needs it.
- No blog/news system unless someone commits to maintaining it.
- No heavy JavaScript framework.

First launch should be clean, fast, secure, and trustworthy. Fancy can come later.
