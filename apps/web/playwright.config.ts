import { createPlaywrightConfig } from '@island.is/testing/e2e'

const playwrightConfig = createPlaywrightConfig({
  webServerUrl: 'http://localhost:4200',
  app: 'web',
  dependencies: ['api'],
})

export default playwrightConfig
