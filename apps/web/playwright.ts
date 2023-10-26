import { defineConfig } from '@playwright/test'

import { definePlayWrightNextConfig } from '@island.is/testing-system'

export default defineConfig({
  ...definePlayWrightNextConfig({
    command: 'yarn nx run web:serve',
  }),
})
