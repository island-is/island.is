import { defineConfig } from '@island.is/nest/config'

export const FeatureFlagConfig = defineConfig({
  name: 'FeatureFlag',
  load: (env) => ({
    sdkKey: env.required(
      'CONFIGCAT_SDK_KEY',
      'YcfYCOwBTUeI04mWOWpPdA/KgCHhUk0_k2BdiKMaNh3qA',
    ),
  }),
})
