import { defineConfig } from '@playwright/test'
import { baseConfig } from '@island.is/testing/e2e'
import { type } from '@nx/devkit'

export default defineConfig({
  ...baseConfig({ filename: __filename, project: 'consultation-portal' }),
})
