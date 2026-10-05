import { getCollection, type CollectionEntry } from 'astro:content';
import { pathForLocale, type Locale } from '~/i18n';

/**
 * Blog post slugs are translated, so `/blog/robots-rate-limits/` has no Bangla
 * twin at `/bd/blog/robots-rate-limits/`. Posts opt into pairing with a
 * `translationKey`; this resolves the counterpart for a given locale.
 *
 * Returns `undefined` when the post has no `translationKey` or no counterpart
 * exists, which callers must treat as "no alternate page" rather than guessing
 * a URL — a wrong alternate is worse than none for both `hreflang` and the
 * language switcher.
 */
export async function findPostTranslation(
  post: CollectionEntry<'posts'>,
  target: Locale,
): Promise<CollectionEntry<'posts'> | undefined> {
  const key = post.data.translationKey;
  if (!key) return undefined;

  const candidates = await getCollection(
    'posts',
    (entry) =>
      !entry.data.draft && entry.data.locale === target && entry.data.translationKey === key,
  );

  return candidates.at(0);
}

/**
 * Path of the translated post in `target`, falling back to that locale's blog
 * index when the article has not been translated yet.
 */
export async function localizedPostPath(
  post: CollectionEntry<'posts'>,
  target: Locale,
): Promise<string> {
  const translation = await findPostTranslation(post, target);
  return translation
    ? pathForLocale(`/blog/${translation.id}/`, target)
    : pathForLocale('/blog/', target);
}
