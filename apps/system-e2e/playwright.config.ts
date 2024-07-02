import { defineConfig } from '@playwright/test'
import { nxE2EPreset } from '@nx/playwright/preset'
import { urls } from './src/support/urls'

// For CI, you may want to set BASE_URL to the deployed application.
// const baseURL = process.env['BASE_URL'] || 'http://localhost:3000'
const baseURL: string = urls.islandisBaseUrl

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: '.' }),
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: process.env.CI ? 'retain-on-failure' : 'on',
  },
  reporter: process.env.CI
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
    : undefined,

  projects: undefined, // Disable preset recommendation
})
