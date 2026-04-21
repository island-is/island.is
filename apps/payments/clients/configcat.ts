import type { IConfigCatClient } from 'configcat-node'

let configCatClient: IConfigCatClient | null = null

export function getConfigcatClient(): IConfigCatClient {
  if (!configCatClient) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const configcat = require('configcat-node')
    configCatClient = configcat.getClient(
      process.env.CONFIGCAT_SDK_KEY,
      configcat.PollingMode.AutoPoll,
      {
        pollIntervalSeconds: 60,
      },
    )
  }
  return configCatClient!
}
