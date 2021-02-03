import { FeatureFlagClient, User, FeatureFlagClientProps } from './types'
import { createClient } from 'configcat-js'

export class Client implements FeatureFlagClient {
  private configcat: ReturnType<typeof createClient>

  constructor(config: FeatureFlagClientProps) {
    const resolvedSdkKey = config.sdkKey ?? process.env.CONFIGCAT_SDK_KEY
    if (!resolvedSdkKey) {
      throw new Error(
        'Trying to initialize configcat client without CONFIGCAT_SDK_KEY environment variable',
      )
    }
    if (typeof window === 'undefined') {
      this.configcat = require('configcat-node').createClient(resolvedSdkKey)
    } else {
      this.configcat = require('configcat-js').createClient(resolvedSdkKey)
    }
  }

  async getValue(key: string, defaultValue: boolean | string, user: User) {
    return await this.configcat.getValueAsync(
      key,
      defaultValue,
      user ? { identifier: user.uuid, custom: user.attributes } : undefined,
    )
  }
}
