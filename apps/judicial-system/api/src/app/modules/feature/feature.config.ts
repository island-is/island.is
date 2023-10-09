import { defineConfig } from '@island.is/nest/config'

import { splitStringByComma } from '@island.is/judicial-system/formatters'

export const featureModuleConfig = defineConfig({
  name: 'FeatureModule',
  load: (env) => ({
    hiddenFeatures: splitStringByComma(env.optional('HIDDEN_FEATURES')),
  }),
})
