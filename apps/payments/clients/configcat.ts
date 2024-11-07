import getConfig from 'next/config'

import * as configcat from 'configcat-js'
import { PollingMode } from 'configcat-js'

const { publicRuntimeConfig } = getConfig()

let configCatClient: configcat.IConfigCatClient | null = null

export function getConfigcatClient() {
  if (!configCatClient) {
    configCatClient = configcat.getClient(
      publicRuntimeConfig.configCatSdkKey,
      PollingMode.AutoPoll,
      {
        pollIntervalSeconds: 60,
      },
    )
  }
  return configCatClient
}
