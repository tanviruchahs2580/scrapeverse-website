import { en, type Dictionary } from './en';
import { bd } from './bd';

export type { Dictionary };
export type Locale = 'en' | 'bd';

export const LOCALES: Locale[] = ['en', 'bd'];
export const DEFAULT_LOCALE: Locale = 'en';

/** BCP-47 tags used for `<html lang>`, `hreflang` and Open Graph locale. */
export const HTML_LANG: Record<Locale, string> = {
  en: 'en',
  bd: 'bn-BD',
};

export const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  bd: 'bn_BD',
};

const DICTIONARIES: Record<Locale, Dictionary> = { en, bd };

export function getDictionary(locale: string): Dictionary {
  return DICTIONARIES[locale as Locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

/**
 * Maps a URL pathname to a locale. `/bd/anything` is Bangla, everything else
 * is English. Used to build the language switcher without asking Astro for
 * routing metadata (which is unavailable on some prerendered paths).
 */
export function localeFromPath(pathname: string): Locale {
  return /^\/bd(\/|$)/.test(pathname) ? 'bd' : 'en';
}

/**
 * Preserves the visitor's position on the page when switching language:
 * `/` -> `/bd/`, `/blog/x` -> `/bd/blog/x`.
 */
export function pathForLocale(pathname: string, target: Locale): string {
  const withoutPrefix = pathname.replace(/^\/bd(\/|$)/, '/').replace(/\/{2,}/g, '/');
  const normalised = withoutPrefix === '' ? '/' : withoutPrefix;
  const withSlash = normalised.endsWith('/') ? normalised : `${normalised}/`;

  return target === 'bd' ? `/bd${withSlash}` : withSlash;
}
