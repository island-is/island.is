import { defineConfig, devices } from '@island.is/testing/e2e'
import './e2e/utils/addons'

const webServerUrl = 'http://localhost:4200'

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: 'e2e',

  // Run all tests in parallel.
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: 'html',

  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: webServerUrl,

    // Collect trace when retrying the failed test.
    trace: 'on-first-retry',
  },
  // Configure projects for major browsers.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Run your local dev server before starting the tests.
  webServer: {
    stdout: 'pipe',
    command:
      'cd infra && yarn cli run-local-env --service service-portal --dependencies api service-portal-api services-documents --print',
    port: 4200,
    reuseExistingServer: !process.env.CI,
    timeout: 5 * 60 * 1000,
    cwd: '../../',
  },
})
