import { createGlobalConfig } from '@island.is/testing/e2e'
import './e2e/utils/addons'

const servicePortalConfig = createGlobalConfig({
  webServerUrl: 'http://localhost:4200',
  port: 4200,
  command:
    'mockoon-cli start --data libs/testing/e2e/src/lib/mocks/service_portal_mocks.json --port 9388 && cd infra && yarn cli run-local-env --service service-portal --dependencies api service-portal-api services-documents --print',
})

export default servicePortalConfig
