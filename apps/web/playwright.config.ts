import { createPlaywrightConfig } from '@island.is/testing/e2e'

const playwrightConfig = createPlaywrightConfig({
  webServerUrl: 'http://localhost:4200',
  command:
    '(cd infra && yarn cli run-local-env web --dependencies api --print --no-secrets --proxies)',
  cwd: '../../',
})

export default playwrightConfig
