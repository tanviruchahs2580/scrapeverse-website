/**
 * Generates public/og.png, the social card referenced by BaseLayout.astro.
 *
 * Rendering it through Chromium rather than hand-encoding a PNG keeps the
 * wordmark crisp and means the card can be restyled as ordinary HTML/CSS.
 * Re-run with: npm run generate:og
 */
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public');

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @font-face {
        font-family: 'Inter';
        src: local('Segoe UI'), local('Inter');
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 1200px;
        height: 630px;
        display: flex;
        align-items: center;
        gap: 56px;
        padding: 0 88px;
        background:
          radial-gradient(900px 620px at 12% 8%, #12b8d6 0%, transparent 55%),
          radial-gradient(760px 560px at 92% 96%, #8b5cf6 0%, transparent 52%),
          #070a10;
        color: #f2f5f9;
        font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
        overflow: hidden;
      }
      .lockup { display: flex; align-items: center; gap: 16px; }
      .lockup span { font-size: 30px; font-weight: 700; letter-spacing: -0.02em; }
      .copy { display: flex; flex-direction: column; gap: 22px; max-width: 760px; }
      h1 {
        font-size: 62px;
        line-height: 1.06;
        font-weight: 700;
        letter-spacing: -0.03em;
      }
      h1 em {
        font-style: normal;
        background: linear-gradient(100deg, #7de9f7, #12b8d6 55%, #8b5cf6);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      p { font-size: 27px; line-height: 1.4; color: #a7b0c0; }
      .domain {
        margin-top: 6px;
        font-family: ui-monospace, 'Cascadia Mono', monospace;
        font-size: 22px;
        letter-spacing: 0.04em;
        color: #7de9f7;
      }
    </style>
  </head>
  <body>
    <div>
      <div class="lockup">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="56" height="56">
          <defs>
            <linearGradient id="g" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#7DE9F7" />
              <stop offset="52%" stop-color="#12B8D6" />
              <stop offset="100%" stop-color="#8B5CF6" />
            </linearGradient>
          </defs>
          <rect width="32" height="32" rx="8" fill="#0A0E15" />
          <circle cx="16" cy="16" r="10.5" fill="none" stroke="url(#g)" stroke-width="2" />
          <path d="M16 5.5a10.5 10.5 0 0 1 9.1 5.2" fill="none" stroke="#0A0E15"
                stroke-width="2.6" stroke-linecap="round" />
          <g stroke="#7DE9F7" stroke-width="1.8" stroke-linecap="round">
            <path d="M12.4 12.6h7.2" />
            <path d="M12.4 16h5.2" />
            <path d="M12.4 19.4h3.2" />
          </g>
          <circle cx="9.4" cy="12.6" r="1.15" fill="#8B5CF6" />
        </svg>
        <span>ScrapeVerse</span>
      </div>
      <div class="copy">
        <h1>Web data extraction,<br /><em>handled properly.</em></h1>
        <p>Managed scraping pipelines that stay online, respect robots.txt, and hand back clean records.</p>
        <div class="domain">scrapeverse.com</div>
      </div>
    </div>
  </body>
</html>`;

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(html, { waitUntil: 'load' });
await page.screenshot({ path: path.join(outDir, 'og.png'), type: 'png' });
await browser.close();

console.log('wrote public/og.png (1200x630)');
