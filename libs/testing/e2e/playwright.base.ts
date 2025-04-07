import { defineConfig } from '@playwright/test'
import { nxE2EPreset } from '@nx/playwright/preset'
import { workspaceRoot } from '@nx/devkit'

// For CI, you may want to set BASE_URL to the deployed application.
const basePort = 4200 // This seems to be hard-coded somewhere, so we can't change it :(
const baseURL = process.env['BASE_URL'] || `http://localhost:${basePort}`

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export const baseConfig = (project: string) =>
  defineConfig({
    ...nxE2EPreset(__filename, { testDir: './e2e' }),
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
      baseURL,
      /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
      trace: process.env.CI ? 'on' : 'on-first-retry',
    },
    /* Run your local dev server before starting the tests */
    webServer: {
      command: `yarn nx serve ${project}`,
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
      cwd: workspaceRoot,
    },
  })
