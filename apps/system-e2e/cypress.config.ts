import { defineConfig } from 'cypress'
import { getCognitoCredentials, testEnvironment } from './src/support/utils'
import { makeEmailAccount } from './src/support/email-account'
// import { sample } from './webpack.config'

// const webpackPreprocessor = require('@cypress/webpack-preprocessor')

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
    async setupNodeEvents(on, config) {
      // const options = {
      //   // send in the options from your webpack.config.js, so it works the same
      //   // as your app's code
      //   webpackOptions: sample,
      // }
      // on('file:preprocessor', webpackPreprocessor(options))
      const emailAccount = await makeEmailAccount()
      on('task', {
        getUserEmail: () => {
          return emailAccount.email
        },

        getLastEmail: () => {
          return emailAccount.getLastEmail()
        },
      })
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
