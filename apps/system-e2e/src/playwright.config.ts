import type {
  PlaywrightTestConfig,
  ReporterDescription,
} from '@playwright/test'
import { join } from 'path'
import './addons'
import { env, urls } from './support/urls'

const localPort = process.env.PORT ?? '4200'

/**
 * The judicial-system suite is timed for a production build (the way CI runs
 * e2e). In dev mode Next compiles every route on first visit, which blows the
 * request waits and makes the suite look flaky. So for local runs of that
 * project, build and serve the production bundle - unless something already
 * listens on the port (e.g. a dev server), which is then reused as-is.
 * The port has to stay 4200 for file uploads to work: the dev S3 bucket only
 * allows that origin in its CORS rules.
 * The islandis project targets remote environments and needs no server.
 */
const judicialSystemWebServer: PlaywrightTestConfig['webServer'] =
  env === 'local' && process.argv.some((arg) => arg.includes('judicial-system'))
    ? {
        command: [
          'yarn nx run judicial-system-web:build:production',
          // The preload gives the server the same .env files nx gives a dev
          // server. The tests use fake national ids, so the registry lookups
          // have to answer with the fakes a dev server would use.
          `NODE_ENV=production PORT=${localPort} ENABLE_LOCAL_PROXY=true MOCK_NATIONAL_REGISTRY=true node -r ./apps/system-e2e/src/support/load-local-env.js dist/apps/judicial-system/web/main.js`,
        ].join(' && '),
        cwd: join(__dirname, '../../..'),
        url: `http://localhost:${localPort}/liveness`,
        reuseExistingServer: true,
        // The production build takes several minutes on a cold nx cache.
        timeout: 15 * 60 * 1000,
        stdout: 'ignore',
        stderr: 'pipe',
      }
    : undefined

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 90 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 20000,
  },
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 0 : 0,
  /* The specs share one database and one server, so parallel files only
     overload the stack - a single worker everywhere, as on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ...((process.env.CI
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
    ['html', { open: 'never' }],
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: urls.islandisBaseUrl,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
  },

  /* Configure our test targets */
  projects: [
    {
      name: 'judicial-system',
      testMatch: 'tests/judicial-system/**/*.spec.[tj]s',
      use: {
        /* Slows down execution in ms */
        launchOptions: {
          slowMo: 200,
        },
      },
    },
    { name: 'islandis', testMatch: 'tests/islandis/**/*.spec.[tj]s' },
    { name: 'everything', testMatch: 'tests/*/**/*.spec.[tj]s' },
    { name: 'smoke', testMatch: 'tests/**/smoke/**/*.spec.[tj]s' },
    { name: 'acceptance', testMatch: 'tests/**/acceptance/**/*.spec.[tj]s' },
  ],

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

  /* Build and serve the app under test before starting the tests */
  webServer: judicialSystemWebServer,
}

export default config
