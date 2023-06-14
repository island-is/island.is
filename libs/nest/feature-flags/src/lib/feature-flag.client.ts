import { Provider } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { createClient } from '@island.is/feature-flags'

import { FeatureFlagConfig } from './feature-flag.config'

export const FEATURE_FLAG_CLIENT = 'FeatureFlagClient'

let clientSingleton: ReturnType<typeof createClient>

export const FeatureFlagClientProvider: Provider = {
  provide: FEATURE_FLAG_CLIENT,
  inject: [FeatureFlagConfig.KEY],
  useFactory({ sdkKey }: ConfigType<typeof FeatureFlagConfig>) {
    // Configcat verbosely complains if you create the same client twice, which we should only be doing in tests.
    // So we singleton it:
    if (!clientSingleton) {
      clientSingleton = createClient({ sdkKey })
    }
    return clientSingleton
  },
}
