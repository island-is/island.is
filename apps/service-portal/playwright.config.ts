import { createGlobalConfig } from '@island.is/testing/e2e'
import './e2e/utils/addons'

const servicePortalConfig = createGlobalConfig({
  webServerUrl: 'http://localhost:4200',
  port: 4200,
  service: 'service-portal',
  dependencies: ['api', 'service-portal-api', 'services-documents'],
})

export default servicePortalConfig
