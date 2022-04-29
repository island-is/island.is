import { getStaticEnv } from '@island.is/shared/utils'

const devConfig = {
  production: false,
  identityServer: {
    authority: 'https://identity-server.dev01.devland.is',
  },
  sentry: {
    dsn:
      'https://3c45a55273774b91a897b85e0a1243d1@o406638.ingest.sentry.io/5501494',
  },
  featureFlagSdkKey: 'YcfYCOwBTUeI04mWOWpPdA/KgCHhUk0_k2BdiKMaNh3qA',
  DD_RUM_CLIENT_TOKEN: 'unknown',
  DD_RUM_APPLICATION_ID: 'unknown',
  APP_VERSION: 'unknown',
  ENVIRONMENT: 'unknown',
}

const prodConfig = {
  production: true,
  identityServer: {
    authority: getStaticEnv('SI_PUBLIC_IDENTITY_SERVER_ISSUER_URL'),
  },
  sentry: {
    dsn:
      'https://3c45a55273774b91a897b85e0a1243d1@o406638.ingest.sentry.io/5501494',
  },
  featureFlagSdkKey: getStaticEnv('SI_PUBLIC_CONFIGCAT_SDK_KEY'),
  DD_RUM_CLIENT_TOKEN: getStaticEnv('DD_RUM_CLIENT_TOKEN'),
  DD_RUM_APPLICATION_ID: getStaticEnv('DD_RUM_APPLICATION_ID'),
  APP_VERSION: getStaticEnv('APP_VERSION'),
  ENVIRONMENT: getStaticEnv('ENVIRONMENT'),
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
