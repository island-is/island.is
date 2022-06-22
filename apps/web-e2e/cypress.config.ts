import { defineConfig } from 'cypress'
import { preprocessTypescript } from '@nrwl/cypress/plugins/preprocessor'
const serviceName = 'web'

export default defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: false,
  videosFolder: `../../dist/cypress/apps/${serviceName}-e2e/videos`,
  screenshotsFolder: `../../dist/cypress/apps/${serviceName}-e2e/screenshots`,
  chromeWebSecurity: false,
  pageLoadTimeout: 240000,
  responseTimeout: 120000,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    specPattern: './src/integration/**/*.ts',
    supportFile: './src/support/index.ts',
    setupNodeEvents(on, config) {
      // See: https://github.com/cypress-io/cypress/issues/9571
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      on('file:preprocessor', () => preprocessTypescript(config))
    },
  },
})
