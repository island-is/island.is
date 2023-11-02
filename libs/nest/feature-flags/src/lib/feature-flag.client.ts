import { FactoryProvider } from '@nestjs/common'
import * as ConfigCatNode from 'configcat-node'
import { ConfigType } from '@island.is/nest/config'
import {
  FeatureFlagClient,
  createClientFactory,
} from '@island.is/feature-flags'
import { FeatureFlagConfig } from './feature-flag.config'

export const FEATURE_FLAG_CLIENT = 'FeatureFlagClient'
const createClient = createClientFactory(ConfigCatNode)

export const FeatureFlagClientProvider: FactoryProvider = {
  provide: FEATURE_FLAG_CLIENT,
  inject: [FeatureFlagConfig.KEY],
  useFactory: ({
    sdkKey,
  }: ConfigType<typeof FeatureFlagConfig>): FeatureFlagClient => {
    return createClient({ sdkKey })
  },
}
