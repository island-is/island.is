import { createPlaywrightConfig } from '@island.is/testing/e2e'
import './e2e/utils/addons'

const applicationPortalApiConfig = createPlaywrightConfig({
  webServerUrl: 'http://localhost:4242',
  port: 4242,
  command:
    '(mockoon-cli start --data ./apps/application-system/form/e2e/mocks/application_portal_mocks.json & cd infra && yarn cli run-local-env application-system-form --dependencies api application-system-api service-portal-api --print && yarn nx run application-system-api:migrate)',
})

export default applicationPortalApiConfig
