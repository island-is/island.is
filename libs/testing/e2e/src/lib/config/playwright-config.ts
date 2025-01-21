import { defineConfig, ReporterDescription } from '@playwright/test'
import { resolve } from 'path'

interface PlaywrightConfigParams {
  webServerUrl: string
  timeoutMs?: number
}

export const createPlaywrightConfig = ({
  webServerUrl,
  timeoutMs = 15 * 60 * 1000,
}: PlaywrightConfigParams) => {
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
      stdout: 'pipe' as const,
      command: `docker-compose up`,
      reuseExistingServer: !process.env.CI,
      timeout: timeoutMs,
      cwd: resolve(__dirname, '../../../../../..'),
      url: webServerUrl,
    },
  })
}
