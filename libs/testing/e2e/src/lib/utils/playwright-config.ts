import { defineConfig, devices } from '@playwright/test'

interface GlobalConfigParams {
  webServerUrl: string
  port?: number
  command: string
  cwd?: string
}

export const createGlobalConfig = ({
  webServerUrl,
  port,
  command,
  cwd = '../../../',
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
    ],
    webServer: {
      stdout: 'pipe',
      port: port ? port : undefined,
      url: port ? undefined : webServerUrl,
      command,
      reuseExistingServer: !process.env.CI,
      timeout: 5 * 60 * 1000,
      cwd,
    },
  })
}
