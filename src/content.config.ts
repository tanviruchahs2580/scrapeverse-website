import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Blog posts are plain Markdown files. Each locale has its own file so the
 * prose can be genuinely translated rather than machine-swapped; `src/i18n`
 * still guarantees the surrounding UI strings stay in parity.
 */
const posts = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().max(90),
    description: z.string().max(220),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    locale: z.enum(['en', 'bd']).default('en'),
    /**
     * Identifies the same article across locales. Slugs are translated
     * (`robots-rate-limits` -> `data-quality-selectors`), so the language
     * switcher and `hreflang` cannot pair posts by slug — they pair by this key.
     * Posts without a counterpart simply have no translation.
     */
    translationKey: z.string().optional(),
    author: z.string().default('ScrapeVerse engineering'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
