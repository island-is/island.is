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
  disableLockScreen: boolean
  env: typeof env
  constants: typeof Constants
}

// Remove WebManifest, it throws a warning in React Native
const { WebManifest, ...ConstantsRest } = Constants

export const config: Config = {
  identityServer: {
    // issuer: env.IDENTITYSERVER_ISSUER || 'https://identity-server.dev01.devland.is',
    issuer: 'https://innskra.island.is',
    clientId: env.IDENTITYSERVER_CLIENT_ID || '@island.is-app',
    // scopes: env.IDENTITYSERVER_SCOPES?.split(' ') || ['openid', 'profile', 'api_resource.scope', 'offline_access'],
    scopes: [
      'openid',
      'profile',
      'api_resource.scope',
      'offline_access',
      '@island.is/applications:read',
    ],
  },
  // apiEndpoint: env.API_ENDPOINT || 'https://beta.dev01.devland.is/api',
  apiEndpoint: 'https://island.is/api',
  bundleId:
    Platform.select({
      ios: env.BUNDLE_ID_IOS,
      android: env.BUNDLE_ID_ANDROID,
    }) || 'is.island.app',
  disableLockScreen: false,
  constants: ConstantsRest,
  env,
}
