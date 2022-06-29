import { defineConfig } from 'cypress'
import { getCognitoCredentials, testEnvironment } from './src/support/utils'

export default defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: false,
  defaultCommandTimeout: 60000,
  pageLoadTimeout: 60000,
  responseTimeout: 12000,
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
      // const options = {
      //   // send in the options from your webpack.config.js, so it works the same
      //   // as your app's code
      //   webpackOptions: require('../application-system/api/webpack.config'),
      //   watchOptions: {},
      // }
      // on('file:preprocessor', WebpackPreprocessor(defaultOptions))

      config.env.testEnvironment = testEnvironment
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
