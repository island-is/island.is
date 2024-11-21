import { defineConfig, ReporterDescription } from '@playwright/test'

interface PlaywrightConfigParams {
  webServerUrl: string
  port?: number
  command?: string
  app?: string
  dependencies?: string[]
  proxies?: boolean
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
 * @param {string} config.app - Application to run.
 * @param {string[]} config.dependencies - List of dependencies.
 * @param {boolean} config.proxies - Whether to use proxies.
 *
 * @returns A configuration object for Playwright E2E tests.
 */
export const createPlaywrightConfig = ({
  webServerUrl,
  port,
  command,
  cwd,
  timeoutMs = 5 * 60 * 1000,
  app,
  dependencies = [],
  proxies = false,
}: PlaywrightConfigParams) => {
  if (!command && !app) {
    throw new Error('Either command or app must be specified.')
  }

  if (!command) {
    command = `yarn infra run-local-env ${app} --print --no-secrets`
    if (dependencies.length > 0) {
      command += ` --dependencies ${dependencies.join(' ')}`
    }
    if (proxies) {
      command += ' --proxies'
    }
  }

  return defineConfig({
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
}
