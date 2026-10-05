# ScrapeVerse — website

Marketing site for **ScrapeVerse**, a web scraping and data extraction service.
Static build, no client framework, English and Bangla.

- **Stack:** Astro 7, Tailwind CSS 4, TypeScript 6, zero-framework vanilla JS
- **Output:** prerendered static HTML in `dist/`, deployed to Netlify
- **Domain:** <https://scrapeverse.com>

## Requirements

Node 22.12 or newer (see `.nvmrc`).

```bash
nvm use
npm install
```

## Commands

| Command                | What it does                                        |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Dev server at `localhost:4321` with HMR             |
| `npm run build`        | Prerender every route into `dist/`                  |
| `npm run preview`      | Serve the built `dist/` locally                     |
| `npm run check`        | `astro check` — TypeScript and `.astro` diagnostics |
| `npm run lint`         | ESLint over `.ts` and `.astro`                      |
| `npm run format`       | Prettier write                                      |
| `npm run format:check` | Prettier check (used in CI)                         |
| `npm run ci`           | `check` + `build`, the gate for a release           |

`typescript` is pinned to `^6`. TypeScript 7 is not yet supported by
`astro check`.

## Project layout

```
astro.config.mjs      Site URL, i18n, sitemap, Tailwind Vite plugin
netlify.toml          Build command, publish dir, security headers, redirects
public/               favicon, robots.txt
src/
  components/
    brand/            Logo
    hero/             Animated terminal panel
    layout/           Announcement bar, nav + drawer, footer, sticky CTA
    sections/         One file per landing-page section
    ui/               Button, Icon, Section, SectionHeader, Reveal, Counter, Aurora
  content/
    blog/             Markdown posts (one file per locale)
    legal.ts          Privacy, terms, DPA and cookies copy in both locales
  i18n/
    en.ts             Single source of truth for all copy
    bd.ts             Typed as the shape of en.ts — drift is a build error
    index.ts          getDictionary(), localeFromPath(), pathForLocale()
  layouts/            BaseLayout (head/metadata), LandingPage, LegalPage
  pages/              Routes; `pages/bd/` mirrors the English tree
  scripts/            main.ts (nav, pricing, counters, reveal), form.ts, analytics.ts
  styles/global.css   Design tokens, layout utilities, motion
```

## Internationalisation

`src/i18n/en.ts` defines the `Dictionary` type. `src/i18n/bd.ts` is annotated
against it, so a key added in English and forgotten in Bangla fails
`npm run check` rather than shipping blank strings.

Astro is configured with `prefixDefaultLocale: false` and does **not** clone
routes for you — `/bd/` pages exist as real files under `src/pages/bd/`.
Both trees must be kept in step; there is no build-time check for that, so add a
page in both places.

To render the same component in either language, pass `locale` and read from
the dictionary rather than hardcoding strings:

```astro
---
import { getDictionary } from '~/i18n';
const { locale } = Astro.props;
const dict = getDictionary(locale);
---

<h2>{dict.pricing.title}</h2>
```

## Forms

`src/components/sections/RequestWizard.astro` is a three-step lead form marked
`data-netlify="true"`. Netlify detects it at build time and handles the POST.

Submission has two paths:

- **JS enabled** — `src/scripts/form.ts` posts via `fetch`, then reveals an
  inline success panel.
- **JS disabled** — the form posts natively and Netlify redirects to the
  localized thanks page (`/thanks/` or `/bd/thanks/`).

Both carry a honeypot field and a timing trap. The no-JS path is why the steps
must stay visible without JavaScript and why submit is not disabled in markup.

Analytics is a no-op shim in `src/scripts/analytics.ts`. Wire a provider there
rather than adding a third-party script to a page.

## Before going live

- [ ] Replace placeholder client logos and testimonials in `src/i18n/en.ts` and
      `src/i18n/bd.ts`
- [ ] Have counsel review `src/content/legal.ts`; the review warnings are
      deliberate placeholders
- [ ] Confirm domain and DNS in Netlify, then submit a real form and verify the
      notification email arrives
- [ ] Add a favicon sized for every target if `public/favicon.ico` is a stub
- [ ] Run Lighthouse against the deployed URL

## Deploying

Netlify reads `netlify.toml`: `npm run build`, publish `dist/`. Connect the
repository and deploy; no other environment variables are required.
