/**
 * Page-level behaviour. Bundled and inlined by Astro (~3 KB before gzip).
 *
 * Design rules honoured here:
 * - Everything degrades. Without JS the nav is still a list of links, the
 *   reveal content is visible, the counters show their final values.
 * - `prefers-reduced-motion` disables the count-up and the nav transitions.
 * - Scroll work is passive and rAF-throttled; nothing here runs a long task.
 */

import { track } from './analytics';
import { initWizard as initFormWizard } from './form';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ reveal */

function initReveal() {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (targets.length === 0) return;

  // Reduced motion: CSS already forces these visible, so skip the observer.
  if (REDUCED_MOTION) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  );

  targets.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------- counters */

function initCounters() {
  const counters = document.querySelectorAll<HTMLElement>('[data-counter]');
  if (counters.length === 0) return;

  const run = (el: HTMLElement) => {
    const target = Number(el.dataset.counter);
    const duration = Number(el.dataset.counterDur ?? 1600);
    const original = el.textContent ?? '';

    if (REDUCED_MOTION || !Number.isFinite(target) || target <= 0) return;

    // Match the source value's precision: 99.9 keeps one decimal, 380 stays whole.
    const decimals = (original.match(/\.(\d+)/)?.[1] ?? '').length;
    const format = (n: number) =>
      n.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = format(target * eased) + original.slice(format(target).length);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        run(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.6 },
  );

  counters.forEach((el) => observer.observe(el));
}

/* -------------------------------------------------------------------- nav */

function initNav() {
  const header = document.getElementById('site-nav');
  const toggle = document.getElementById('nav-toggle');
  const drawer = document.getElementById('nav-drawer');
  if (!header) return;

  /* scrolled state */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrolled = window.scrollY > 12;
      header.classList.toggle('border-line', scrolled);
      header.classList.toggle('bg-ink-950/80', scrolled);
      header.classList.toggle('backdrop-blur-xl', scrolled);
      ticking = false;
    });
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* mobile drawer */
  if (toggle && drawer) {
    const labelOpen = toggle.getAttribute('aria-label') ?? '';

    const setOpen = (open: boolean) => {
      toggle.setAttribute('aria-expanded', String(open));
      drawer.classList.toggle('invisible', !open);
      drawer.classList.toggle('opacity-0', !open);
      drawer.classList.toggle('max-h-0', !open);
      drawer.classList.toggle('max-h-[80svh]', open);
      drawer.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';

      if (open) {
        drawer.querySelector<HTMLAnchorElement>('a')?.focus();
      } else {
        toggle.setAttribute('aria-label', labelOpen);
        toggle.focus();
      }
    };

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    drawer.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false);
    });

    // Close if the viewport grows past the desktop breakpoint.
    const desktop = window.matchMedia('(min-width: 64rem)');
    desktop.addEventListener('change', (event) => {
      if (event.matches && toggle.getAttribute('aria-expanded') === 'true') setOpen(false);
    });
  }

  /* scroll spy for the desktop links */
  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute('href')?.split('#')[1];
      return id ? document.getElementById(id) : null;
    })
    .filter((el): el is HTMLElement => el !== null);

  if (sections.length === 0) return;

  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const id = entry.target.id;
        for (const link of navLinks) {
          const active = link.getAttribute('href')?.endsWith(`#${id}`);
          link.classList.toggle('text-fg', active === true);
          link.classList.toggle('text-fg-subtle', active !== true);
        }
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );

  sections.forEach((section) => spy.observe(section));
}

/* --------------------------------------------------- announcement + sticky */

function initDismissibles() {
  const close = document.getElementById('announcement-close');
  const bar = document.getElementById('announcement');
  const KEY = 'sv.announcement.dismissed';

  if (close && bar) {
    if (sessionStorage.getItem(KEY) === '1') {
      bar.remove();
    } else {
      close.addEventListener('click', () => {
        sessionStorage.setItem(KEY, '1');
        bar.remove();
      });
    }
  }

  const sticky = document.getElementById('sticky-cta');
  const stickyClose = document.getElementById('sticky-cta-close');
  if (!sticky) return;

  const hero = document.querySelector('main > section');

  const update = () => {
    const pastHero = hero ? window.scrollY > hero.clientHeight * 0.85 : window.scrollY > 700;
    const atForm =
      document.getElementById('request') !== null &&
      (() => {
        const rect = document.getElementById('request')!.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      })();

    sticky.classList.toggle('translate-y-full', !pastHero || atForm);
    sticky.setAttribute('aria-hidden', String(!(pastHero && !atForm)));
  };

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    },
    { passive: true },
  );
  update();

  stickyClose?.addEventListener('click', () => {
    sticky.classList.add('translate-y-full');
    sticky.setAttribute('aria-hidden', 'true');
  });
}

function initBackToTop() {
  const button = document.getElementById('back-to-top');
  button?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
  });
}

/* --------------------------------------------------------------- pricing */

function initPricingToggle() {
  const group = document.getElementById('pricing-toggle');
  if (!group) return;

  const buttons = Array.from(group.querySelectorAll<HTMLButtonElement>('[data-billing]'));
  const prices = Array.from(document.querySelectorAll<HTMLElement>('[data-price]'));

  const select = (mode: string) => {
    for (const button of buttons) {
      const active = button.dataset.billing === mode;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('bg-brand-400', active);
      button.classList.toggle('text-ink-950', active);
      button.classList.toggle('text-fg-subtle', !active);
    }

    for (const node of prices) {
      const monthly = node.dataset.priceMonthly ?? '';
      const oneTime = node.dataset.priceOneTime;
      const suffix = node.parentElement?.querySelector<HTMLElement>('[data-price-suffix]');

      if (!oneTime) continue; // custom-priced plans stay as-is

      node.textContent = mode === 'monthly' ? monthly : oneTime;
      if (suffix) {
        suffix.textContent =
          mode === 'monthly'
            ? (node.dataset.suffixMonthly ?? '')
            : (node.dataset.suffixOneTime ?? '');
      }
    }
  };

  for (const button of buttons) {
    button.addEventListener('click', () => select(button.dataset.billing ?? 'monthly'));
  }

  select('monthly');
}

/* -------------------------------------------------------------- analytics */

function initAnalytics() {
  document.addEventListener('click', (event) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-track]');
    if (target?.dataset.track) track(target.dataset.track);
  });
}

/* ------------------------------------------------------------------ wizard */

function initWizard() {
  const node = document.querySelector<HTMLScriptElement>('[data-wizard-strings]');
  if (!node) return;
  try {
    initFormWizard(document, JSON.parse(node.textContent ?? '{}'));
  } catch {
    // A malformed strings blob must not take the rest of the page down. The
    // form still posts natively because it is a real <form>, so the lead is safe.
    initFormWizard(document);
  }
}

/* ------------------------------------------------------------------ boot */

function init() {
  initReveal();
  initCounters();
  initNav();
  initDismissibles();
  initBackToTop();
  initPricingToggle();
  initAnalytics();
  initWizard();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
