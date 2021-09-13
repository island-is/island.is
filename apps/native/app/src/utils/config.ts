import { Platform } from 'react-native'
import env from 'react-native-ultimate-config'
import { Constants } from 'react-native-unimodules'

export interface Config {
  identityServer: {
    issuer: string
    clientId: string
    scopes: string[]
  }
  apiEndpoint: string
  bundleId: string
  sentryDsn: string
  constants: any
  env: typeof env
}

const { WebManifest, ...ConstantsRest } = Constants

const defaults = {
  identityServer: {
    issuer: 'https://innskra.island.is',
    scopes: [
      'openid',
      'profile',
      '@island.is/user-profile:read',
      'offline_access',
    ],
    clientId: '@island.is/apps/scanner',
  },
  apiEndpoint: 'https://island.is/api',
}

export const config: Config = {
  identityServer: {
    clientId: defaults.identityServer.clientId,
    issuer: defaults.identityServer.issuer,
    scopes:
      defaults.identityServer.scopes,
  },
  apiEndpoint: defaults.apiEndpoint,
  bundleId: 'is.island.scanner',
  sentryDsn: env.SENTRY_DSN,
  constants: ConstantsRest,
  env,
}

if (__DEV__) {
  console.log(config)
}
