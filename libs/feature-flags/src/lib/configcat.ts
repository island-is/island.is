import {
  IAutoPollOptions,
  DataGovernance,
  IConfigCatClient,
  PollingMode,
} from 'configcat-common'
import {
  FeatureFlagClient,
  FeatureFlagUser,
  SettingValue,
  SettingTypeOf,
  ConfigCatModule,
  FeatureFlagClientProps,
} from './types'
import { SDK_KEY_ERROR } from './constants'

export const createFeatureFlagClient = (
  config: FeatureFlagClientProps,
  moduleProvider: ConfigCatModule,
): FeatureFlagClient => {
  const resolvedSdkKey = config.sdkKey || process.env.CONFIGCAT_SDK_KEY

  if (!resolvedSdkKey) {
    throw new Error(SDK_KEY_ERROR)
  }

  const ccConfig: IAutoPollOptions = {
    dataGovernance: DataGovernance.EuOnly,
  }

  const client: IConfigCatClient = moduleProvider.getClient(
    resolvedSdkKey,
    PollingMode.AutoPoll,
    ccConfig,
  )

  return {
    dispose: () => {
      client.dispose()
    },
    getValue: async <T extends SettingValue>(
      key: string,
      defaultValue: T,
      user?: FeatureFlagUser,
    ): Promise<SettingTypeOf<T>> => {
      return await client.getValueAsync(
        key,
        defaultValue,
        user ? { identifier: user.id, custom: user.attributes } : undefined,
      )
    },
  }
}
