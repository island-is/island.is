import { defineConfig } from 'cypress'
const serviceName = 'service-portal'

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
  },
})
