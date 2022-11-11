import { getStaticEnv } from '@island.is/shared/utils'

const devConfig = {
  production: false,
  baseApiUrl: 'http://localhost:4444',
  identityServer: {
    authority: 'https://identity-server.dev01.devland.is',
  },
  featureFlagSdkKey: 'YcfYCOwBTUeI04mWOWpPdA/KgCHhUk0_k2BdiKMaNh3qA',
  DD_RUM_CLIENT_TOKEN: 'unknown',
  DD_RUM_APPLICATION_ID: 'unknown',
  APP_VERSION: 'unknown',
  ENVIRONMENT: 'unknown',
}

const prodConfig = {
  production: true,
  baseApiUrl: window.location.origin,
  identityServer: {
    authority: getStaticEnv('SI_PUBLIC_IDENTITY_SERVER_ISSUER_URL'),
  },
  featureFlagSdkKey: getStaticEnv('SI_PUBLIC_CONFIGCAT_SDK_KEY'),
  DD_RUM_CLIENT_TOKEN: getStaticEnv('SI_PUBLIC_DD_RUM_CLIENT_TOKEN'),
  DD_RUM_APPLICATION_ID: getStaticEnv('SI_PUBLIC_DD_RUM_APPLICATION_ID'),
  ENVIRONMENT: getStaticEnv('SI_PUBLIC_ENVIRONMENT'),
  APP_VERSION: getStaticEnv('APP_VERSION'),
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
