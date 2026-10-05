import { defineConfig, devices } from '@playwright/test';

/**
 * The suite runs against `dist/` served by `astro preview`, not the dev server:
 * the thing being verified is the artifact that actually gets deployed.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  timeout: 45_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:4321',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],

  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm run preview -- --port 4321',
        url: 'http://localhost:4321/',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
