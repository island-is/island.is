import { workspaceRoot } from '@nx/devkit'
import { defineConfig, devices } from '@playwright/test'

const port = process.env.BASE_URL ? undefined : process.env.PORT ?? 4200
const baseURL = process.env.BASE_URL ?? `http://localhost:${port ?? 4200}`
const runAll = process.env.RUN_ALL_BROWSERS === 'true'

const defaultBrowser = [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
]

const extraBrowsers = [
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },

  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
]

export const definePlayWrightConfig = ({
  command,
  testDir,
}: {
  command: string
  testDir: string
}) => {
  return defineConfig({
    testDir: testDir,
    webServer: {
      command,
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      cwd: workspaceRoot,
    },
    workers: 3,
    fullyParallel: true,
    reporter: 'line',
    retries: process.env.CI ? 2 : 0,
    projects: [...defaultBrowser, ...(runAll ? extraBrowsers : [])],
    use: {
      trace: 'on-first-retry',
      headless: !!process.env.CI,
      baseURL,
      browserName: 'chromium',
    },
  })
}

export const definePlayWrightNextConfig = ({ command }: { command: string }) =>
  definePlayWrightConfig({ command, testDir: './system-tests' })

export const definePlayWrightServiceConfig = ({
  command,
}: {
  command: string
}) => definePlayWrightConfig({ command, testDir: './src/system-tests' })
