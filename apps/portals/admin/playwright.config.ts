import { createPlaywrightConfig } from '@island.is/testing/e2e'
import './e2e/utils/addons'

const adminPortalConfig = createPlaywrightConfig({
  webServerUrl: 'http://localhost:4200',
  port: 4200,
  command:
    '(mockoon-cli start --data ./apps/portals/my-pages/e2e/mocks/service_portal_mocks.json --port 9388 & cd infra && yarn cli run-local-env service-portal --dependencies api service-portal-api services-documents --print)',
})

export default adminPortalConfig
