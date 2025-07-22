import { defineConfig } from '@playwright/test'
import { nxE2EPreset } from '@nx/playwright/preset'
import { workspaceRoot } from '@nx/devkit'

const MINUTE = 60_000

export type BaseConfig = {
  /** The `__filename` of the calling file. */
  filename: string
  /** The name of the project this config belongs to. */
  project: string
  /** (Optional) The base URL for API calls or similar use cases. */
  baseURL?: string
  /** (Optional) The base path for playwright to use. */
  basePath?: string
  /** (Optional) List of dependencies to start along with the service. */
  dependencies?: string[]
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export const baseConfig = ({
  filename,
  project,
  baseURL = process.env['BASE_URL'] ||
    `http://localhost:${process.env.PORT || 4200}`,
  basePath = process.env.BASE_PATH || '/',
  dependencies = [],
}: BaseConfig) => {
  baseURL = `${baseURL}/${basePath.replace(/^\//, '')}`
  return defineConfig({
    ...nxE2EPreset(filename, { testDir: './e2e' }),
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
      baseURL,
      /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
      trace: 'on',
    },
    fullyParallel: true,
    /* Run your local dev server before starting the tests */
    webServer: {
      command: `yarn infra run-local-env --no-secrets ${project} --dependencies ${dependencies.join(
        ' ',
      )}`,
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
      timeout: 5 * MINUTE,
      cwd: workspaceRoot,
    },
    reporter: process.env.CI ? 'line' : 'html',
  })
}
