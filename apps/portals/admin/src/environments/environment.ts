import { getStaticEnv } from '@island.is/shared/utils'

const devConfig = {
  production: false,
  featureFlagSdkKey: 'YcfYCOwBTUeI04mWOWpPdA/KgCHhUk0_k2BdiKMaNh3qA',
  DD_LOGS_CLIENT_TOKEN: 'unknown',
  APP_VERSION: 'unknown',
  ENVIRONMENT: 'unknown',
}

const prodConfig = {
  production: true,
  featureFlagSdkKey: getStaticEnv('SI_PUBLIC_CONFIGCAT_SDK_KEY'),
  DD_LOGS_CLIENT_TOKEN: getStaticEnv('SI_PUBLIC_DD_LOGS_CLIENT_TOKEN'),
  ENVIRONMENT: getStaticEnv('SI_PUBLIC_ENVIRONMENT'),
  APP_VERSION: getStaticEnv('APP_VERSION'),
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
