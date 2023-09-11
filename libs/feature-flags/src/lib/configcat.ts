import {
  IAutoPollOptions,
  DataGovernance,
  IConfigCatClient,
  PollingMode,
} from 'configcat-common'
import {
  FeatureFlagClient,
  FeatureFlagUser,
  FeatureFlagClientProps,
  SettingValue,
  SettingTypeOf,
} from './types'
import { getConfigCatModule } from './utils'

export class Client implements FeatureFlagClient {
  private configcat: IConfigCatClient

  private constructor(client: IConfigCatClient) {
    this.configcat = client
  }

  static async create(config: FeatureFlagClientProps): Promise<Client> {
    const resolvedSdkKey = config.sdkKey ?? process.env.CONFIGCAT_SDK_KEY
    if (!resolvedSdkKey) {
      throw new Error(
        `Trying to initialize configcat client without CONFIGCAT_SDK_KEY environment variable. Resolved key: ${resolvedSdkKey}`,
      )
    }

    const ccConfig: IAutoPollOptions = {
      dataGovernance: DataGovernance.EuOnly,
    }

    const configCatModule = await getConfigCatModule()
    const client = configCatModule.getClient(
      resolvedSdkKey,
      PollingMode.AutoPoll,
      ccConfig,
    )

    return new Client(client)
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
