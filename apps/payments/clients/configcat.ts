import getConfig from 'next/config'
import type { IConfigCatClient } from 'configcat-js'

const { publicRuntimeConfig } = getConfig()

let configCatClient: IConfigCatClient | null = null

function getServerSideClient() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const configcat = require('configcat-node')
  return configcat.getClient(
    publicRuntimeConfig.configCatSdkKey,
    configcat.PollingMode.AutoPoll,
    {
      pollIntervalSeconds: 60,
    },
  )
}

function getBrowserClient() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const configcat = require('configcat-js')
  return configcat.getClient(
    publicRuntimeConfig.configCatSdkKey,
    configcat.PollingMode.AutoPoll,
    {
      pollIntervalSeconds: 60,
    },
  )
}

export function getConfigcatClient() {
  if (!configCatClient) {
    const isServerSide = typeof window === 'undefined'
    configCatClient = isServerSide ? getServerSideClient() : getBrowserClient()
  }
  return configCatClient
}
