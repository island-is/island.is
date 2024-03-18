import config from '../../playwright.config.base'

import type { PlaywrightTestConfig } from '@playwright/test'

const localConfig: PlaywrightTestConfig = {
  // testMatch: '**/*.spec.ts',
  testDir: './e2e',
}
export default { ...config, ...localConfig }
