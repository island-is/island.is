import { ConfigType } from '@island.is/nest/config'
import { createClient } from '@island.is/feature-flags'

import { FeatureFlagConfig } from './feature-flag.config'

export const FEATURE_FLAG_CLIENT = 'FeatureFlagClient'

export const FeatureFlagClientProvider = {
  provide: FEATURE_FLAG_CLIENT,
  inject: [FeatureFlagConfig.KEY],
  useFactory({ sdkKey }: ConfigType<typeof FeatureFlagConfig>) {
    return createClient({ sdkKey })
  },
}
