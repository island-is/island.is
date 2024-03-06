import { defineConfig } from '@playwright/test'
import { nxE2EPreset } from '@nx/playwright/preset'
// eslint-disable-next-line @typescript-eslint/no-unused-vars

// For CI, you may want to set BASE_URL to the deployed application.
// const baseURL = process.env['BASE_URL'] || 'http://localhost:3000'
const baseUrls = {
  local: `http://localhost:${process.env.PORT || 4200}`,
  dev: 'https://beta.dev01.devland.is',
  staging: 'https://beta.staging01.devland.is',
  prod: 'https://island.is',
}
const testEnv = (process.env.TEST_ENVIRONMENT ??
  'local') as keyof typeof baseUrls
const baseURL: string = baseUrls[testEnv]

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: '.' }),
  forbidOnly: !!process.env.CI,
  retries: !!process.env.CI ? 1 : 0,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: !!process.env.CI ? 'retain-on-failure' : 'on',
  },
  /* Run your local dev server before starting the tests */ // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
  // projects: [
  //   {
  //     name: 'chromium',
  //     use: { ...devices['Desktop Chrome'] },
  //   },
  //
  //   {
  //     name: 'firefox',
  //     use: { ...devices['Desktop Firefox'] },
  //   },
  //
  //   {
  //     name: 'webkit',
  //     use: { ...devices['Desktop Safari'] },
  //   },
  //
  //   // Uncomment for mobile browsers support
  //   /* {
  //     name: 'Mobile Chrome',
  //     use: { ...devices['Pixel 5'] },
  //   },
  //   {
  //     name: 'Mobile Safari',
  //     use: { ...devices['iPhone 12'] },
  //   }, */
  //
  //   // Uncomment for branded browsers
  //   /* {
  //     name: 'Microsoft Edge',
  //     use: { ...devices['Desktop Edge'], channel: 'msedge' },
  //   },
  //   {
  //     name: 'Google Chrome',
  //     use: { ...devices['Desktop Chrome'], channel: 'chrome' },
  //   } */
  // ],
})
