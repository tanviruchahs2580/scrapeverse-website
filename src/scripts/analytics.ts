/**
 * Analytics shim.
 *
 * Deliberately ships zero third-party JS. If Plausible, GTM, or a dataLayer is
 * present on the page it picks the event up; otherwise this is a no-op. That
 * keeps the default bundle small and avoids a cookie banner we do not need.
 */

export interface AnalyticsWindow extends Window {
  plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}

export function track(event: string, props: Record<string, string | number | boolean> = {}) {
  const w = window as AnalyticsWindow;
  const stringified = Object.fromEntries(
    Object.entries(props).map(([key, value]) => [key, String(value)]),
  );

  w.plausible?.(event, { props: stringified });
  w.gtag?.('event', event, stringified);
  w.dataLayer?.push({ event, ...stringified });
}
