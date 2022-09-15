import { defineConfig } from 'cypress'
import { getCognitoCredentials, getEnvironmentUrls } from './src/support/utils'
import { emailTask } from './src/support/tasks/email'

import type { TestEnvironment } from './src/lib/types'
import { Timeout } from './src/lib/types'

export default defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: false,
  defaultCommandTimeout: Timeout.long,
  pageLoadTimeout: Timeout.medium,
  responseTimeout: Timeout.short,
  viewportWidth: 1024,
  viewportHeight: 768,
  projectId: 'xw5cuj',
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    specPattern: '**/*.spec.{js,ts}',
    experimentalSessionAndOrigin: true,
    supportFile: '**/support/index.{js,ts}',
    setupNodeEvents(on, config) {
      on('task', { ...emailTask })
      const testEnvironment: TestEnvironment =
        process.env.TEST_ENVIRONMENT || 'local'
      if (testEnvironment !== 'local') {
        config.env.cognito = getCognitoCredentials()
      }
      if (!process.env.BASE_URL_PREFIX) {
        process.env.BASE_URL_PREFIX = ''
      }
      config.env.basePrefix = process.env.BASE_URL_PREFIX
      const { baseUrl, authUrl } = getEnvironmentUrls(testEnvironment)
      config.env.testEnvironment = testEnvironment
      config.env.authUrl = authUrl
      config.baseUrl = baseUrl
      return config
    },
  },
})
