import { defineConfig, devices } from '@playwright/test'

interface GlobalConfigParams {
  webServerUrl: string
  port?: number
  command: string
  cwd?: string
  timeoutMs?: number
}

export const createGlobalConfig = ({
  webServerUrl,
  port,
  command,
  cwd = '../../../',
  timeoutMs = 5 * 60 * 1000,
}: GlobalConfigParams) => {
  return defineConfig({
    testDir: 'e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',

    use: {
      baseURL: webServerUrl,
      trace: 'on-first-retry',
    },
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
      {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
      },
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
}
