import { baseConfig } from '../../playwright.base'
import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...baseConfig('unicorn-app'),
})
