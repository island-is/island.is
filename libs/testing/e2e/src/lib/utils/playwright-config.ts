import { defineConfig, devices } from '@playwright/test'

interface GlobalConfigParams {
  webServerUrl: string
  port: number
  service: string
  dependencies: string[]
  mockFile: string
}

export const createGlobalConfig = ({
  webServerUrl,
  port,
  service,
  dependencies,
  mockFile,
}: GlobalConfigParams) => {
  const mockoonCommand = `mockoon-cli start --data libs/testing/e2e/src/lib/mocks/${mockFile} --port 9388`
  const serviceCommand = `cd infra && yarn cli run-local-env --services ${service} --dependencies ${dependencies.join(
    ' ',
  )}`

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
      command: `${mockoonCommand} & ${serviceCommand}`,
      port,
      reuseExistingServer: !process.env.CI,
      timeout: 5 * 60 * 1000,
      cwd: '../../../',
    },
  })
}
