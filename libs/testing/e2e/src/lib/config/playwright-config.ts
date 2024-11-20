import { defineConfig, ReporterDescription } from '@playwright/test'

interface PlaywrightConfigParams {
  webServerUrl: string
  port?: number
  command: string
  cwd?: string
  timeoutMs?: number
}

/**
 * Creates a Playwright configuration for running end-to-end tests with
 * customizable server settings, reporting options, and project environments.
 *
 * @param {PlaywrightConfigParams} config - Configuration options for the Playwright setup.
 * @param {string} config.webServerUrl - Base URL for the web server used in tests.
 * @param {number} config.port - Optional port number for the web server.
 * @param {string} config.command - Command to start the web server.
 * @param {string} config.cwd - Working directory for the web server command.
 * @param {number} config.timeoutMs - Timeout in milliseconds for server startup.
 *
 * @returns A configuration object for Playwright E2E tests.
 */
export const createPlaywrightConfig = ({
  webServerUrl,
  port,
  command,
  cwd = '../../../',
  timeoutMs = 5 * 60 * 1000,
}: PlaywrightConfigParams) =>
  defineConfig({
    testDir: 'e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
      ...((process.env.CI
        ? [['json', { outputFile: 'test-results.json' }]]
        : [['dot']]) as ReporterDescription[]),
      ['html', { open: 'never' }],
    ],

    use: {
      baseURL: webServerUrl,
      trace: 'on-first-retry',
    },
    projects: [
      { name: 'everything', testMatch: 'e2e/**/*.spec.[tj]s' },
      { name: 'smoke', testMatch: 'e2e/smoke/**/*.spec.[tj]s' },
      { name: 'acceptance', testMatch: 'e2e/acceptance/**/*.spec.[tj]s' },
    ],
    webServer: {
      stdout: 'pipe',
      port: port ? port : undefined,
      url: port ? undefined : webServerUrl,
      command,
      reuseExistingServer: !process.env.CI,
      timeout: timeoutMs,
      cwd,
    },
  })
