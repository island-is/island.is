import { createGlobalConfig } from '@island.is/testing/e2e'

import './e2e/utils/addons'

const webConfig = createGlobalConfig({
  webServerUrl: 'http://localhost:4200',
  command: 'yarn dev-init web && source .env.secret && yarn dev web',
  cwd: '../../',
})

export default webConfig
