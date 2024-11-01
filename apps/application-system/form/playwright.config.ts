import { createGlobalConfig } from '@island.is/testing/e2e'
import './e2e/utils/addons'

const applicationPortalApiConfig = createGlobalConfig({
  webServerUrl: 'http://localhost:4242',
  port: 4242,
  command:
    '(mockoon-cli start --data ./apps/application-system/form/e2e/mocks/application_portal_mocks.json & cd infra && yarn cli run-local-env application-system-form --dependencies service-portal-api services-documents endorsement-system-api skilavottord-ws user-notification application-system-api icelandic-names-registry-backend services-sessions services-university-gateway --print)',
})

export default applicationPortalApiConfig
