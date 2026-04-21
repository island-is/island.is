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

  const toConfigCatUser = (user?: FeatureFlagUser) =>
    user ? { identifier: user.id, custom: user.attributes } : undefined

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
        toConfigCatUser(user),
      )
    },
    getAllValues: async (
      user?: FeatureFlagUser,
    ): Promise<Record<string, boolean | string>> => {
      const keyValues = await client.getAllValuesAsync(toConfigCatUser(user))
      const result: Record<string, boolean | string> = {}
      for (const kv of keyValues) {
        if (
          typeof kv.settingValue === 'boolean' ||
          typeof kv.settingValue === 'string'
        ) {
          result[kv.settingKey] = kv.settingValue
        }
      }
      return result
    },
  }
}
