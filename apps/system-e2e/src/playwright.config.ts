import { PlaywrightTestConfig } from '@playwright/test'
import './addons.ts'

console.log('Reading System-e2e Playwright config')

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 90 * 1000,
  expect: {
    timeout: 20000,
  },
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [
        ['line'],
        [
          'playwright-tesults-reporter',
          { 'tesults-target': process.env.TESULTS_TOKEN },
        ],
        ['html', { open: 'never' }],
      ]
    : 'line',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
    // baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  outputDir: 'dist/test-results/',
}
export default config
