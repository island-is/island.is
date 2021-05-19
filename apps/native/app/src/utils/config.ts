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
      'api_resource.scope',
      'offline_access',
      '@island.is/applications:read',
    ],
    clientId: '@island.is-app',
  },
  apiEndpoint: 'https://island.is/api',
}

export const config: Config = {
  identityServer: {
    clientId: env.IDENTITYSERVER_CLIENT_ID || '@island.is-app',
    issuer: env.IDENTITYSERVER_ISSUER || defaults.identityServer.issuer,
    scopes:
      env.IDENTITYSERVER_SCOPES?.split(' ') || defaults.identityServer.scopes,
  },
  apiEndpoint: env.API_ENDPOINT || defaults.apiEndpoint,
  bundleId:
    Platform.select({
      ios: env.BUNDLE_ID_IOS,
      android: env.BUNDLE_ID_ANDROID,
    }) || 'is.island.app',
  sentryDsn: env.SENTRY_DSN,
  constants: ConstantsRest,
  env,
}
