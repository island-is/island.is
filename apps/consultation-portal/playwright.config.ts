import { createGlobalConfig } from '@island.is/testing/e2e'
import './e2e/utils/addons'

const consultationPortalConfig = createGlobalConfig({
  webServerUrl: 'http://localhost:4200',
  port: 4200,
  command:
    'yarn get-secrets consultation-portal && yarn get-secrets api && cd infra && yarn cli run-local-env consultation-portal --dependencies api --print',
  cwd: '../../',
})

export default consultationPortalConfig
