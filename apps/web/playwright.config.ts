import config from '../../playwright.config.base'

import type { PlaywrightTestConfig } from '@playwright/test'

const localConfig: PlaywrightTestConfig = {
  testDir: './e2e',
  webServer: {
    port: 4200,
    command: 'yarn run-local-env --service=web',
    reuseExistingServer: true,
  },
}
export default { ...config, ...localConfig }
