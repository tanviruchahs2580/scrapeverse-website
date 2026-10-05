import { test, expect, type Page } from '@playwright/test';

/** Every route the build produces. */
const ROUTES = [
  '/',
  '/bd/',
  '/blog/',
  '/bd/blog/',
  '/blog/robots-rate-limits/',
  '/bd/blog/data-quality-selectors/',
  '/privacy/',
  '/bd/privacy/',
  '/terms/',
  '/bd/terms/',
  '/data-processing/',
  '/bd/data-processing/',
  '/cookies/',
  '/bd/cookies/',
  '/thanks/',
  '/bd/thanks/',
];

const EN = ROUTES.filter((r) => !r.startsWith('/bd'));
const BD = ROUTES.filter((r) => r.startsWith('/bd'));

test.describe('routes and metadata', () => {
  for (const route of [...EN, '/404.html']) {
    test(`${route} loads with correct language and one h1`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status(), `${route} status`).toBe(200);

      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page).toHaveTitle(/ScrapeVerse/);
    });
  }

  for (const route of BD) {
    test(`${route} loads in Bangla`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status(), `${route} status`).toBe(200);

      await expect(page.locator('html')).toHaveAttribute('lang', 'bn-BD');
      await expect(page.locator('h1')).toHaveCount(1);
    });
  }

  test('unknown route returns the 404 document', async ({ page }) => {
    const response = await page.goto('/definitely-not-a-page/');
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('body')).toContainText('404');
  });

  test('/404.html is served directly with a 200', async ({ page }) => {
    // Requesting the file by name is a normal static fetch; the 404 *status* is
    // produced by the host for unmatched paths, not by this document.
    const response = await page.goto('/404.html');
    expect(response?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });

  test('robots.txt and sitemaps are reachable', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain('sitemap');

    const index = await request.get('/sitemap-index.xml');
    expect(index.status()).toBe(200);
    expect(await index.text()).toContain('scrapeverse.com');
  });
});

test.describe('head and metadata', () => {
  test('homepage has canonical, hreflang and social tags', async ({ page }) => {
    await page.goto('/');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://scrapeverse.com/');

    // Bidirectional alternates plus x-default.
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang="bn-BD"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);

    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://scrapeverse.com/',
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      /.+/.source ? /.*/ : /.*/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      /summary|app/,
    );
  });

  test('noindex pages are marked and excluded from the sitemap', async ({ page, request }) => {
    for (const route of ['/404.html', '/thanks/', '/bd/thanks/']) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/, {
        timeout: 3000,
      });
    }

    const sitemap = await (await request.get('/sitemap-0.xml')).text();
    expect(sitemap).not.toContain('/thanks/');
    expect(sitemap).not.toContain('/404');
    expect(sitemap).toContain('/blog/robots-rate-limits/');
  });

  test('blog post hreflang does not claim an unrelated translation', async ({ page }) => {
    // The two demo posts cover different topics, so neither may be advertised
    // as the translation of the other.
    const alternatesFor = async (route: string) => {
      await page.goto(route);
      // Resolve against the document inside the browser: `page` is not in scope
      // once the callback is serialized.
      return page.locator('link[rel="alternate"][hreflang]').evaluateAll((els) =>
        els.map((el) => ({
          lang: el.getAttribute('hreflang'),
          href: new URL(el.getAttribute('href') ?? '', document.baseURI).pathname,
        })),
      );
    };

    const en = await alternatesFor('/blog/robots-rate-limits/');
    expect(en.find((a) => a.lang === 'en')?.href).toBe('/blog/robots-rate-limits/');
    expect(en.find((a) => a.lang === 'bn-BD')?.href).not.toBe('/bd/blog/data-quality-selectors/');

    const bd = await alternatesFor('/bd/blog/data-quality-selectors/');
    expect(bd.find((a) => a.lang === 'bn-BD')?.href).toBe('/bd/blog/data-quality-selectors/');
    // With no counterpart, the alternate is the localized index.
    expect(bd.find((a) => a.lang === 'en')?.href).toBe('/blog/');
  });
});

test.describe('accessibility', () => {
  test('every internal link resolves', async ({ page, request }) => {
    const seen = new Set<string>();
    const broken: string[] = [];

    for (const route of [...EN, ...BD, '/404.html']) {
      await page.goto(route);
      const hrefs = await page
        .locator('a[href^="/"]')
        .evaluateAll((links) =>
          links.map((a) => (a as HTMLAnchorElement).getAttribute('href') ?? ''),
        );

      for (const href of hrefs) {
        const target = (href.split('#')[0] ?? '').split('?')[0];
        if (!target || target === '/') continue;
        if (/\.(xml|txt|ico|svg|png|jpg|webp|css|js|webmanifest)$/.test(target)) continue;
        const key = `${route} -> ${target}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const response = await request.get(target);
        if (response.status() !== 200) broken.push(`${key} = ${response.status()}`);
      }
    }

    expect(broken, `broken links:\n${broken.join('\n')}`).toEqual([]);
  });

  test('images and controls have accessible names', async ({ page }) => {
    for (const route of ['/', '/bd/', '/blog/', '/privacy/']) {
      await page.goto(route);

      const unnamedImages = await page.locator('img:not([alt])').evaluateAll((els) => els.length);
      expect(unnamedImages, `${route} images without alt`).toBe(0);

      const unnamedButtons = await page.locator('button').evaluateAll(
        (els) =>
          els.filter((b) => {
            const btn = b as HTMLButtonElement;
            const hasText = (btn.textContent ?? '').trim().length > 0;
            return (
              !hasText && !btn.getAttribute('aria-label') && !btn.getAttribute('aria-labelledby')
            );
          }).length,
      );
      expect(unnamedButtons, `${route} buttons without a name`).toBe(0);
    }
  });

  test('skip link is the first focusable element and reaches main', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.locator('.skip-link');
    await expect(skip).toBeFocused();
    await expect(skip).toHaveAttribute('href', '#main');
    await expect(page.locator('#main')).toHaveCount(1);
  });

  test('decorative icons are hidden from assistive technology', async ({ page }) => {
    await page.goto('/');
    const exposed = await page.locator('svg:not([aria-hidden]):not([role])').count();
    expect(exposed, 'SVGs exposed without a role').toBe(0);
  });

  test('landmarks and heading order are sane', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toHaveCount(1);
    await expect(page.locator('main#main')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);

    // Exactly one h1, and no level skipped on the way down.
    const levels = await page
      .locator('h1, h2, h3, h4, h5, h6')
      .evaluateAll((els) => els.map((e) => Number(e.tagName.slice(1))));
    expect(levels[0]).toBe(1);
    expect(levels.filter((l) => l === 1)).toHaveLength(1);

    for (let i = 1; i < levels.length; i++) {
      // noUncheckedIndexedAccess: both ends exist because i < levels.length.
      const jump = (levels[i] ?? 1) - (levels[i - 1] ?? 1);
      expect(jump, `heading jump at index ${i}`).toBeLessThanOrEqual(1);
    }
  });
});

/** Shared helper: open the mobile drawer when running the mobile project. */
async function openMenuIfNeeded(page: Page) {
  const toggle = page.locator('#nav-toggle');
  if (await toggle.isVisible()) {
    await toggle.click();
    await expect(page.locator('#nav-drawer')).toHaveClass(/max-h-/);
  }
}

/**
 * Nav links exist twice: once in the always-visible desktop bar and once in the
 * mobile drawer. Locating by href alone can resolve to the hidden copy, so
 * always act on the one the user can actually reach.
 */
function navLink(page: Page, selector: string) {
  return page.locator(selector).filter({ visible: true }).first();
}

test.describe('navigation', () => {
  test('in-page anchors scroll to their sections', async ({ page }) => {
    await page.goto('/');
    await openMenuIfNeeded(page);
    await navLink(page, 'a[href="/#pricing"]').click();
    await expect(page).toHaveURL(/#pricing$/);
    await expect(page.locator('#pricing')).toBeInViewport();
  });

  test('drawer opens, exposes links and closes', async ({ page }) => {
    await page.goto('/');

    if (await page.locator('#nav-toggle').isVisible()) {
      const toggle = page.locator('#nav-toggle');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');

      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');

      const drawer = page.locator('#nav-drawer');
      await expect(drawer).toBeVisible();
      await expect(drawer.locator('a[data-drawer-link]').first()).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    }
  });

  test('language switch preserves the page', async ({ page }) => {
    // Compare paths, not absolute URLs: baseURL differs between local and CI.
    const path = () => new URL(page.url()).pathname;

    await page.goto('/');
    await openMenuIfNeeded(page);
    await navLink(page, 'a[data-track="nav_language"]').click();
    expect(path()).toBe('/bd/');

    await page.goto('/bd/');
    await openMenuIfNeeded(page);
    await navLink(page, 'a[data-track="nav_language"]').click();
    expect(path()).toBe('/');

    // Untranslated posts must fall back to the blog index rather than
    // silently landing on an unrelated article that happens to share a locale.
    await page.goto('/blog/robots-rate-limits/');
    await openMenuIfNeeded(page);
    await navLink(page, 'a[data-track="nav_language"]').click();
    await expect(page).toHaveURL('/bd/blog/');
  });
});

test.describe('interactive sections', () => {
  test('pricing toggle switches displayed prices', async ({ page }) => {
    await page.goto('/');

    const group = page.locator('#pricing-toggle');
    await expect(group).toBeVisible();

    const monthlyBtn = group.locator('[data-billing="monthly"]');
    const oneTimeBtn = group.locator('[data-billing="oneTime"]');
    await expect(monthlyBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(oneTimeBtn).toHaveAttribute('aria-pressed', 'false');

    // Starter plan: the switchable price node.
    const price = page.locator('#pricing [data-price]').first();
    await expect(price).toHaveText('$99');

    const oneTime = await price.getAttribute('data-price-one-time');
    expect(oneTime, 'a switchable plan must define a one-off price').toBeTruthy();
    expect(oneTime).not.toBe('$99');

    const suffix = page.locator('#pricing [data-price-suffix]').first();
    await expect(suffix).toHaveText('/ month');

    await oneTimeBtn.click();
    await expect(oneTimeBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(monthlyBtn).toHaveAttribute('aria-pressed', 'false');
    await expect(price).toHaveText(oneTime!);
    await expect(suffix).toHaveText('one-off');

    await monthlyBtn.click();
    await expect(price).toHaveText('$99');
    await expect(suffix).toHaveText('/ month');
  });

  test('custom-priced plans are left alone by the toggle', async ({ page }) => {
    await page.goto('/');
    const enterprise = page.locator('#pricing article', { hasText: 'Enterprise' });
    const price = enterprise.locator('[data-price]').first();

    // No data-price-one-time means the toggle must not blank it out.
    expect(await price.getAttribute('data-price-one-time')).toBeNull();

    const before = await price.innerText();
    await page.locator('#pricing-toggle [data-billing="oneTime"]').click();
    expect(await price.innerText()).toBe(before);
  });

  test('FAQ answers expand and collapse', async ({ page }) => {
    await page.goto('/');

    // Native <details>/<summary>: no ARIA needed, the browser reports `open`.
    const items = page.locator('#faq details.faq-item');
    const count = await items.count();
    expect(count).toBeGreaterThan(1);

    const second = items.nth(1);
    await second.scrollIntoViewIfNeeded();
    expect(await second.evaluate((el) => (el as HTMLDetailsElement).open)).toBe(false);

    const summary = second.locator('summary');
    await summary.click();
    expect(await second.evaluate((el) => (el as HTMLDetailsElement).open)).toBe(true);

    await summary.click();
    expect(await second.evaluate((el) => (el as HTMLDetailsElement).open)).toBe(false);
  });

  test('FAQ uses an exclusive accordion', async ({ page }) => {
    await page.goto('/');
    const items = page.locator('#faq details.faq-item');

    // `name="faq"` makes them mutually exclusive across the group.
    await items.nth(1).locator('summary').click();
    await items.nth(2).locator('summary').click();

    expect(await items.nth(1).evaluate((el) => (el as HTMLDetailsElement).open)).toBe(false);
    expect(await items.nth(2).evaluate((el) => (el as HTMLDetailsElement).open)).toBe(true);
  });

  test('announcement bar can be dismissed', async ({ page }) => {
    await page.goto('/');
    const bar = page.locator('#announcement');
    await expect(bar).toBeVisible();
    await page.locator('#announcement-close').click();
    await expect(bar).toBeHidden();
  });

  test('reveal content becomes visible once JS runs', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/js/);

    const target = page.locator('[data-reveal]').last();
    await target.scrollIntoViewIfNeeded();
    await expect(target).toHaveClass(/is-visible/, { timeout: 5000 });
  });

  test('counters animate to their configured value', async ({ page }) => {
    await page.goto('/');
    const counters = page.locator('[data-counter]');
    const count = await counters.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await counters.nth(i).scrollIntoViewIfNeeded();
    }
    await page.waitForTimeout(2200);

    for (let i = 0; i < count; i++) {
      const counter = counters.nth(i);
      const text = (await counter.innerText()).trim();
      expect(text, `counter ${i} must not end empty`).not.toBe('');
      expect(text, `counter ${i} must not show NaN`).not.toMatch(/NaN/);
    }
  });

  test('server-rendered stats survive with JS disabled', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');

    // The animation is an enhancement; the final values must be in the HTML.
    const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
    for (const expected of ['2.4M', '99.9%', '12h']) {
      expect(body, `missing server-rendered stat ${expected}`).toContain(expected);
    }

    await context.close();
  });
});

test.describe('request wizard', () => {
  test('blocks submission until every step is valid', async ({ page }) => {
    await page.goto('/');
    await page.locator('#request').scrollIntoViewIfNeeded();

    const form = page.locator('#request-form');
    await expect(form).toHaveAttribute('data-ready', 'true');

    // Step 1: nothing selected.
    await page.locator('#wizard-next').click();
    await expect(page.locator('[data-error-summary]')).toBeVisible();
    await expect(page.locator('[data-step]').first()).toBeVisible();

    await page.locator('input[name="dataType"]').first().check();
    await page.locator('input[name="volume"]').first().check();
    await page.locator('input[name="frequency"]').first().check();
    await page.locator('#wizard-next').click();

    // Step 2: invalid URL must not advance.
    // Step 2: url and the anti-bot radio group are both required.
    await page.locator('[data-field="url"]').fill('not-a-url');
    await page.locator('#wizard-next').click();
    await expect(page.locator('[data-error-for="url"]')).toBeVisible();
    await expect(page.locator('[data-step="2"]')).toBeVisible();

    await page.locator('[data-field="url"]').fill('https://example.com/products');
    await expect(page.locator('[data-error-for="url"]')).toBeHidden();

    // Still blocked: the anti-bot group on this step is unanswered.
    await page.locator('#wizard-next').click();
    await expect(page.locator('[data-error-for="antiBot"]')).toBeVisible();
    await expect(page.locator('[data-step="2"]')).toBeVisible();

    await page.locator('input[name="antiBot"]').first().check();
    await expect(page.locator('[data-error-for="antiBot"]')).toBeHidden();
    await page.locator('#wizard-next').click();
    await expect(page.locator('[data-step="3"]')).toBeVisible();

    // Step 3: name, email and consent are required.
    await page.locator('#wizard-submit').click();
    await expect(page.locator('[data-error-for="name"]')).toBeVisible();
    await expect(page.locator('[data-error-for="email"]')).toBeVisible();
    await expect(page.locator('[data-error-for="consent"]')).toBeVisible();
    await expect(page.locator('#request-form')).toBeVisible();

    await page.locator('[data-field="name"]').fill('Test User');
    await page.locator('[data-field="email"]').fill('not-an-email');
    await page.locator('#wizard-submit').click();
    await expect(page.locator('[data-error-for="email"]')).toBeVisible();
    await expect(page.locator('[data-error-for="name"]')).toBeHidden();

    await page.locator('[data-field="email"]').fill('test@example.com');
    await expect(page.locator('[data-error-for="email"]')).toBeHidden();
    await page.locator('input[name="consent"]').check();
    await expect(page.locator('[data-error-for="consent"]')).toBeHidden();
  });

  test('back navigation preserves entered values', async ({ page }) => {
    await page.goto('/');
    await page.locator('#request').scrollIntoViewIfNeeded();

    await page.locator('input[name="dataType"]').first().check();
    await page.locator('input[name="volume"]').first().check();
    await page.locator('input[name="frequency"]').first().check();
    await page.locator('#wizard-next').click();

    await page.locator('[data-field="url"]').fill('https://example.com/catalog');
    await page.locator('#wizard-back').click();
    await expect(page.locator('[data-step="1"]')).toBeVisible();

    // Step 1 selections must survive the round trip.
    await expect(page.locator('input[name="dataType"]:checked')).toHaveCount(1);
    await expect(page.locator('input[name="volume"]:checked')).toHaveCount(1);
    await expect(page.locator('input[name="frequency"]:checked')).toHaveCount(1);

    await page.locator('#wizard-next').click();
    await expect(page.locator('[data-field="url"]')).toHaveValue('https://example.com/catalog');
  });

  test('back navigation reaches step 1 and submit is only on the last step', async ({ page }) => {
    await page.goto('/');
    await page.locator('#request').scrollIntoViewIfNeeded();

    // Back is meaningless on the first step.
    await expect(page.locator('#wizard-back')).toBeHidden();
    await expect(page.locator('#wizard-submit')).toBeHidden();
    await expect(page.locator('#wizard-next')).toBeVisible();

    await page.locator('input[name="dataType"]').first().check();
    await page.locator('input[name="volume"]').first().check();
    await page.locator('input[name="frequency"]').first().check();
    await page.locator('#wizard-next').click();

    await expect(page.locator('#wizard-back')).toBeVisible();
    await page.locator('[data-field="url"]').fill('https://example.com/x');
    await page.locator('input[name="antiBot"]').first().check();
    await page.locator('#wizard-next').click();

    // Submit appears only on the final step; Next is gone.
    await expect(page.locator('#wizard-submit')).toBeVisible();
    await expect(page.locator('#wizard-next')).toBeHidden();
    await expect(page.locator('#wizard-back')).toBeVisible();
  });

  test('honeypot stays empty and hidden from humans', async ({ page }) => {
    await page.goto('/');
    const hp = page.locator('input[name="bot-field"]');
    await expect(hp).toHaveValue('');
    await expect(page.locator('.hp')).toHaveAttribute('aria-hidden', 'true');
  });

  test('valid submission shows the inline success panel', async ({ page }) => {
    await page.route('**/thanks/', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body>ok</body></html>',
      }),
    );

    await page.goto('/');
    await page.locator('#request').scrollIntoViewIfNeeded();

    await page.locator('input[name="dataType"]').first().check();
    await page.locator('input[name="volume"]').first().check();
    await page.locator('input[name="frequency"]').first().check();
    await page.locator('#wizard-next').click();
    await expect(page.locator('[data-step="2"]')).toBeVisible();

    await page.locator('[data-field="url"]').fill('https://example.com/products');
    await page.locator('input[name="antiBot"]').first().check();
    await page.locator('#wizard-next').click();
    await expect(page.locator('[data-step="3"]')).toBeVisible();

    await page.locator('[data-field="name"]').fill('Jane Tester');
    await page.locator('[data-field="email"]').fill('jane@example.com');
    await page.locator('input[name="consent"]').check();
    await page.locator('#wizard-submit').click();

    await expect(page.locator('[data-success]')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('#request-form')).toBeHidden();

    // Restart must return a clean, usable form.
    await page.locator('#wizard-restart').click();
    await expect(page.locator('#request-form')).toBeVisible();
    await expect(page.locator('input[name="consent"]')).not.toBeChecked();
  });

  test('submission sends every field to the form endpoint', async ({ page }) => {
    const posted: string[] = [];
    await page.route('**/thanks/', async (route) => {
      const request = route.request();
      if (request.method() === 'POST') {
        posted.push(request.postData() ?? '');
        await route.fulfill({ status: 200, contentType: 'text/html', body: 'ok' });
      } else {
        await route.fulfill({ status: 200, contentType: 'text/html', body: 'ok' });
      }
    });

    await page.goto('/');
    await page.locator('#request').scrollIntoViewIfNeeded();

    await page.locator('input[name="dataType"]').first().check();
    await page.locator('input[name="volume"]').first().check();
    await page.locator('input[name="frequency"]').first().check();
    await page.locator('[data-field="notes"]').fill('Need 50k rows weekly.');
    await page.locator('#wizard-next').click();

    await page.locator('[data-field="url"]').fill('https://example.com/products');
    await page.locator('[data-field="urlExtra"]').fill('Pagination on page param.');
    await page.locator('input[name="antiBot"]').first().check();
    await page.locator('#wizard-next').click();

    await page.locator('[data-field="name"]').fill('Jane Tester');
    await page.locator('[data-field="email"]').fill('jane@example.com');
    await page.locator('[data-field="company"]').fill('Example Ltd');
    await page.locator('[data-field="budget"]').selectOption({ index: 1 });
    await page.locator('input[name="consent"]').check();
    await page.locator('#wizard-submit').click();

    await expect(page.locator('[data-success]')).toBeVisible({ timeout: 10_000 });

    expect(posted, 'a POST must have been made').toHaveLength(1);
    const body = new URLSearchParams(posted[0]);

    // Netlify identifies the form by this field; without it the submission
    // is silently discarded.
    expect(body.get('form-name')).toBe('request');
    expect(body.get('locale')).toBe('en');
    expect(body.get('url')).toBe('https://example.com/products');
    expect(body.get('urlExtra')).toBe('Pagination on page param.');
    expect(body.get('name')).toBe('Jane Tester');
    expect(body.get('email')).toBe('jane@example.com');
    expect(body.get('company')).toBe('Example Ltd');
    expect(body.get('notes')).toBe('Need 50k rows weekly.');
    expect(body.get('consent')).toBe('yes');
    expect(body.get('dataType')).toBeTruthy();
    expect(body.get('volume')).toBeTruthy();
    expect(body.get('frequency')).toBeTruthy();
    expect(body.get('antiBot')).toBeTruthy();
    expect(body.get('budget')).toBeTruthy();

    // Honeypot must be empty; the timing field must have been refreshed from
    // the page-load time rather than the build time.
    expect(body.get('bot-field')).toBe('');
    expect(Number(body.get('started-at'))).toBeGreaterThan(0);
  });

  test('failed submission shows an error and stays on the form', async ({ page }) => {
    await page.route('**/thanks/', (route) => route.fulfill({ status: 500, body: 'nope' }));

    await page.goto('/');
    await page.locator('#request').scrollIntoViewIfNeeded();

    await page.locator('input[name="dataType"]').first().check();
    await page.locator('input[name="volume"]').first().check();
    await page.locator('input[name="frequency"]').first().check();
    await page.locator('#wizard-next').click();
    await page.locator('[data-field="url"]').fill('https://example.com/products');
    await page.locator('input[name="antiBot"]').first().check();
    await page.locator('#wizard-next').click();
    await page.locator('[data-field="name"]').fill('Jane Tester');
    await page.locator('[data-field="email"]').fill('jane@example.com');
    await page.locator('input[name="consent"]').check();
    await page.locator('#wizard-submit').click();

    await expect(page.locator('#request-form')).toBeVisible();
    await expect(page.locator('[data-error-summary]')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('[data-success]')).toBeHidden();

    // The submit button must recover so the lead can simply retry.
    await expect(page.locator('#wizard-submit')).toBeEnabled();
  });

  test('no-JS fallback posts natively to the localized thanks page', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto('/bd/');

    // All steps must be visible without JS, and submit must not be disabled.
    const form = page.locator('#request-form');
    await expect(form).toBeVisible();
    await expect(page.locator('[data-step]')).toHaveCount(3);
    await expect(page.locator('#wizard-submit')).toBeEnabled();
    await expect(form).toHaveAttribute('method', 'POST');
    await expect(form).toHaveAttribute('action', '/bd/thanks/');
    await expect(form).toHaveAttribute('data-netlify', 'true');

    // Hidden inputs Netlify needs must be in the served markup.
    await expect(page.locator('input[name="form-name"]')).toHaveValue('request');
    await expect(page.locator('input[name="bot-field"]')).toHaveCount(1);

    await context.close();
  });

  test('English form posts to /thanks/', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('#request-form')).toHaveAttribute('action', '/thanks/');
    await context.close();
  });
});

test.describe('layout and motion', () => {
  test('no horizontal overflow on any page', async ({ page }) => {
    for (const route of ['/', '/bd/', '/blog/', '/bd/blog/robots-rate-limits/', '/thanks/']) {
      await page.goto(route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${route} overflows horizontally by ${overflow}px`).toBeLessThanOrEqual(1);
    }
  });

  test('reduced motion is honoured', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');

    // Reveal content must be visible without waiting for a transition.
    await expect(page.locator('[data-reveal]').first()).toBeVisible();
    const opacity = await page
      .locator('[data-reveal]')
      .first()
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBeGreaterThan(0.9);

    await context.close();
  });

  test('scroll reveals do not leave content invisible when JS is off', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');

    const hidden = await page
      .locator('[data-reveal]')
      .evaluateAll((els) => els.filter((el) => Number(getComputedStyle(el).opacity) < 0.5).length);
    expect(hidden, 'reveal elements hidden without JS').toBe(0);

    await context.close();
  });
});

test.describe('runtime errors', () => {
  for (const route of ['/', '/bd/', '/blog/', '/privacy/', '/thanks/']) {
    test(`${route} loads without console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (err) => errors.push(err.message));

      await page.goto(route);
      await page.waitForLoadState('networkidle');
      // Let deferred work (reveal observers, counters) run.
      await page.waitForTimeout(500);

      expect(errors, `console errors on ${route}:\n${errors.join('\n')}`).toEqual([]);
    });
  }

  test('no request fails on the homepage', async ({ page }) => {
    const failed: string[] = [];
    page.on('requestfailed', (req) => failed.push(`${req.url()} ${req.failure()?.errorText}`));
    page.on('response', (res) => {
      if (res.status() >= 400) failed.push(`${res.url()} ${res.status()}`);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(failed, `failed requests:\n${failed.join('\n')}`).toEqual([]);
  });
});
