import {
  IAutoPollOptions,
  DataGovernance,
  IConfigCatClient,
} from 'configcat-common'
import {
  FeatureFlagClient,
  FeatureFlagUser,
  FeatureFlagClientProps,
  SettingValue,
  SettingTypeOf,
} from './types'

// Use a function to determine the correct module
const getConfigCatModule = () => {
  if (typeof window === 'undefined') {
    return require('configcat-node')
  } else {
    return require('configcat-js')
  }
}

const configCatModule = getConfigCatModule()

export class Client implements FeatureFlagClient {
  private configcat: IConfigCatClient

  constructor(config: FeatureFlagClientProps) {
    const resolvedSdkKey = config.sdkKey ?? process.env.CONFIGCAT_SDK_KEY
    if (!resolvedSdkKey) {
      throw new Error(
        'Trying to initialize configcat client without CONFIGCAT_SDK_KEY environment variable',
      )
    }

    const ccConfig: IAutoPollOptions = {
      dataGovernance: DataGovernance.EuOnly,
    }

    this.configcat = configCatModule.getClient(resolvedSdkKey, null, ccConfig)
  }

  dispose() {
    this.configcat.dispose()
  }

  async getValue<T extends SettingValue>(
    key: string,
    defaultValue: T,
    user: FeatureFlagUser,
  ): Promise<SettingTypeOf<T>> {
    return await this.configcat.getValueAsync(
      key,
      defaultValue,
      user ? { identifier: user.id, custom: user.attributes } : undefined,
    )
  }
}
