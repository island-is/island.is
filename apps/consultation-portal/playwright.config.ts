import { createPlaywrightConfig } from '@island.is/testing/e2e'

const consultationPortalConfig = createPlaywrightConfig({
  webServerUrl: 'http://localhost:4200/',
  app: 'consultation-portal',
  dependencies: ['api'],
})

export default consultationPortalConfig
