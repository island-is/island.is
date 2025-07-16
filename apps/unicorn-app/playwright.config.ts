import { defineConfig } from '@playwright/test'

import { baseConfig } from '@island.is/testing/e2e'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...baseConfig({ filename: __filename, project: 'unicorn-app' }),
})
