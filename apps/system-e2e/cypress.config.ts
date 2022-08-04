import { defineConfig } from 'cypress'
import { getCognitoCredentials, testEnvironment } from './src/support/utils'

export default defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: false,
  defaultCommandTimeout: 3000,
  pageLoadTimeout: 3000,
  responseTimeout: 2000,
  videosFolder: '../../dist/cypress/apps/web-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/web-e2e/screenshots',
  chromeWebSecurity: false,
  viewportWidth: 1024,
  viewportHeight: 768,
  projectId: 'xw5cuj',
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    specPattern: './src/integration/**/*.ts',
    experimentalSessionAndOrigin: true,
    supportFile: './src/support/index.ts',
    setupNodeEvents(on, config) {
      config.env.testEnvironment = testEnvironment
      config.env.apiUrl = config.env[testEnvironment].apiUrl
      if (testEnvironment !== 'local') {
        const { cognitoUsername, cognitoPassword } = getCognitoCredentials()
        config.env.cognitoUsername = cognitoUsername
        config.env.cognitoPassword = cognitoPassword
      }
      config.baseUrl = config.env[testEnvironment].baseUrl
      return config
    },
  },
})
// ci-cache-bust-01
