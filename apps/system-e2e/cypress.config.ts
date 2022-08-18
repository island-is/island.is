import { defineConfig } from 'cypress'
import { getCognitoCredentials } from './src/support/utils'
import { TestEnvironment, BaseUrl, AuthUrl } from './src/lib/types'

const getEnvironmentUrls = (env: TestEnvironment) => {
  return env === 'dev'
    ? { authUrl: AuthUrl.dev, baseUrl: BaseUrl.dev }
    : env === 'prod'
    ? { authUrl: AuthUrl.prod, baseUrl: BaseUrl.prod }
    : env === 'staging'
    ? { authUrl: AuthUrl.staging, baseUrl: BaseUrl.staging }
    : { authUrl: AuthUrl.local, baseUrl: BaseUrl.local }
}

export default defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: false,
  defaultCommandTimeout: 60000,
  pageLoadTimeout: 60000,
  responseTimeout: 12000,
  videosFolder: '../../dist/apps/system-e2e/videos',
  screenshotsFolder: '../../dist/apps/system-e2e/screenshots',
  viewportWidth: 1024,
  viewportHeight: 768,
  projectId: 'xw5cuj',
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    chromeWebSecurity: false,
    specPattern: '**/*.spec.{js,ts}',
    experimentalSessionAndOrigin: true,
    supportFile: '**/support/index.{js,ts}',
    setupNodeEvents(on, config) {
      const testEnvironment: TestEnvironment =
        process.env.TEST_ENVIRONMENT || 'local'
      if (testEnvironment !== 'local') {
        config.env.cognito = getCognitoCredentials()
      }
      const { baseUrl, authUrl } = getEnvironmentUrls(testEnvironment)
      config.env.testEnvironment = testEnvironment
      config.env.authUrl = authUrl
      config.baseUrl = baseUrl
      return config
    },
  },
})
