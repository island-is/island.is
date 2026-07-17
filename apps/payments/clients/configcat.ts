import type { IConfigCatClient } from '@configcat/sdk'

let configCatClient: IConfigCatClient | null = null

export function getConfigcatClient(): IConfigCatClient {
  if (!configCatClient) {
    const configcat = require('@configcat/sdk/node')
    const sdkKey = process.env.CONFIGCAT_SDK_KEY
    if (!sdkKey) {
      throw new Error('Missing CONFIGCAT_SDK_KEY environment variable')
    }
    configCatClient = configcat.getClient(
      sdkKey,
      configcat.PollingMode.AutoPoll,
      {
        pollIntervalSeconds: 60,
      },
    )
  }
  return configCatClient!
}
