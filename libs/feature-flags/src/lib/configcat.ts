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
    if (typeof window === 'undefined') {
      this.configcat = eval('require')('configcat-node').getClient(
        resolvedSdkKey,
        null,
        ccConfig,
      )
    } else {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      this.configcat = require('configcat-js').getClient(
        resolvedSdkKey,
        null,
        ccConfig,
      )
    }
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
