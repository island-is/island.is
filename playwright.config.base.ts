import type {
  PlaywrightTestConfig,
  ReporterDescription,
} from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

export const CI = !!process.env.CI || process.env.NODE_ENV === 'prod'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: '**/e2e',
  /* Maximum time one test can run for. */
  timeout: 90 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    // timeout: 20000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!CI,
  /* Retry on CI only */
  retries: CI ? 0 : 0,
  /* Opt out of parallel tests on CI. */
  workers: CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ...((CI
      ? [
          ['line'],
          [
            'playwright-tesults-reporter',
            {
              'tesults-target': process.env.TESULTS_TOKEN,
              'tesults-build-name': process.env.COMMIT_INFO,
              'tesults-build-result': 'pass',
              'tesults-build-reason': 'Always succeed 💯',
              'tesults-build-description': process.env.COMMIT_INFO_MESSAGE,
            },
          ],
        ]
      : [['dot']]) as ReporterDescription[]),
    ['html', { open: 'on-failure', outputFolder: 'dist/playwright-report' }],
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    // actionTimeout: 15 * 1000,
    // navigationTimeout: 30 * 1000,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:4200',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: CI ? 'retain-on-failure' : 'on',
  },

  /* Configure projects for major browsers */
  // projects: [
  // {
  //   name: "chromium",
  //   use: {
  //     ...devices["Desktop Chrome"],
  //   },
  // },

  // {
  //   name: 'firefox',
  //   use: {
  //     ...devices['Desktop Firefox'],
  //   },
  // },

  // {
  //   name: 'webkit',
  //   use: {
  //     ...devices['Desktop Safari'],
  //   },
  // },

  /* Test against mobile viewports. */
  // {
  //   name: 'Mobile Chrome',
  //   use: {
  //     ...devices['Pixel 5'],
  //   },
  // },
  // {
  //   name: 'Mobile Safari',
  //   use: {
  //     ...devices['iPhone 12'],
  //   },
  // },

  /* Test against branded browsers. */
  // {
  //   name: 'Microsoft Edge',
  //   use: {
  //     channel: 'msedge',
  //   },
  // },
  // {
  //   name: 'Google Chrome',
  //   use: {
  //     channel: 'chrome',
  //   },
  // },
  // ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'dist/test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
}

export default config
