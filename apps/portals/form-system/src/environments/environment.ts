import { getStaticEnv } from '@island.is/shared/utils'

const devConfig = {
  production: false,
  baseApiUrl: 'http://localhost:3000',
  identityServer: {
    authority: 'https://identity-server.dev01.devland.is',
  },
  featureFlagSdkKey: '', // ??
  DD_RUM_CLIENT_TOKEN: 'unknown',
  DD_RUM_APPLICATION_ID: 'unknown',
  APP_VERSION: 'unknown',
  ENVIRONMENT: 'unknown',
}

const prodConfig = {
  production: true,
  baseApiUrl: '',
  identityServer: {},
  featureFlagSdkKey: '',
  DD_RUM_CLIENT_TOKEN: 'unknown',
  DD_RUM_APPLICATION_ID: 'unknown',
  APP_VERSION: 'unknown',
  ENVIRONMENT: 'unknown',
}

export default getStaticEnv('PROD_MODE') === 'true' ||
  process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig
