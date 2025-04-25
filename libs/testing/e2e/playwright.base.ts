import { defineConfig } from '@playwright/test'
import { nxE2EPreset } from '@nx/playwright/preset'
import { workspaceRoot } from '@nx/devkit'

export type BaseConfig = {
  project: string
  baseURL?: string
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export const baseConfig = ({
  project,
  baseURL = process.env['BASE_URL'] ||
    `http://localhost:${process.env.PORT || 4200}`,
}: BaseConfig) =>
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
