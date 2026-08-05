import { getStaticEnv } from '@island.is/shared/utils'

const devConfig = {
  production: false,
  DD_LOGS_CLIENT_TOKEN: 'unknown',
  APP_VERSION: 'unknown',
  ENVIRONMENT: 'unknown',
  userProfile: {
    serviceBasePath: 'http://localhost:3366',
  },
}

const prodConfig = {
  production: true,
  DD_LOGS_CLIENT_TOKEN: getStaticEnv('SI_PUBLIC_DD_LOGS_CLIENT_TOKEN'),
  ENVIRONMENT: getStaticEnv('SI_PUBLIC_ENVIRONMENT'),
  APP_VERSION: getStaticEnv('APP_VERSION'),
}

export default getStaticEnv('PROD_MODE') === 'true' ||
process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig
