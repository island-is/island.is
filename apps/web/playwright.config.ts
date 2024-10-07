import { defineConfig, devices } from '@island.is/testing/e2e'

const webServerUrl = 'http://127.0.0.1:4200'

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
    trace: process.env.CI ? 'on-first-retry' : 'on',
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
    command: 'yarn dev web',
    url: webServerUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 5 * 60 * 1000,
    stdout: 'pipe',
  },
})
