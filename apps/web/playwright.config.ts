import { playwrightPreset } from '../../playwright.config.base'

import type { PlaywrightTestConfig } from '@playwright/test'

const localConfig: PlaywrightTestConfig = {
  testDir: './e2e',
  timeout: 3 * 60 * 1000,
  webServer: {
    port: 4200,
    command:
      'yarn infra run-local-env --service=web --dependencies=api --proxies',
    timeout: 2 * 60 * 1000, // 2 minutes for the slow web 🐌
    reuseExistingServer: true,
    stdout: 'pipe',
    stderr: 'pipe',
  },
}
export default { ...playwrightPreset, ...localConfig }
