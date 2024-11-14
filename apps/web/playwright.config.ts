import { createPlaywrightConfig } from '@island.is/testing/e2e'

import './e2e/utils/addons'

const webConfig = createPlaywrightConfig({
  webServerUrl: 'http://localhost:4200',
  command: '(yarn dev-init web && yarn dev web)',
  cwd: '../../',
})

export default webConfig
