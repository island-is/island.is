import { defineConfig } from '@playwright/test'

import { baseConfig } from '@island.is/testing/e2e'

export default defineConfig({
  ...baseConfig({ filename: __filename, project: 'my-pages' }),
})
