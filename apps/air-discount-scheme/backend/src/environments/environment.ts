import { Airlines } from '@island.is/air-discount-scheme/consts'
import { XRoadMemberClass } from '@island.is/shared/utils/server'

const devConfig = {
  production: false,
  environment: 'local',
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  nationalRegistry: {
    url: process.env.NATIONAL_REGISTRY_URL,
    username: process.env.NATIONAL_REGISTRY_USERNAME,
    password: process.env.NATIONAL_REGISTRY_PASSWORD,
    xroad: {
      basePath: 'http://localhost:8081/r1/IS-DEV', // process.env.XROAD_BASE_PATH_WITH_ENV
      memberCode: process.env.XROAD_TJODSKRA_MEMBER_CODE ?? '10001',
      apiPath:
        process.env.XROAD_TJODSKRA_API_PATH ?? '/SKRA-Protected/Einstaklingar',
      clientId:
        process.env.XROAD_TJODSKRA_CLIENT_ID ??
        'IS-DEV/GOV/10000/island-is-client',
      memberClass: XRoadMemberClass.GovernmentInstitution,
    },
  },
  airlineApiKeys: {
    [Airlines.icelandair]: Airlines.icelandair,
    [Airlines.ernir]: Airlines.ernir,
    [Airlines.norlandair]: Airlines.norlandair,
  },
  redis: {
    urls: [
      'localhost:7000',
      'localhost:7001',
      'localhost:7002',
      'localhost:7003',
      'localhost:7004',
      'localhost:7005',
    ],
  },
  baseUrl: process.env.BASE_URL ?? 'http://localhost:4200',
  identityServerAuth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '@vegagerdin.is',
  },
  idsTokenCookieName: process.env.IDS_COOKIE_NAME ?? 'next-auth.session-token',
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.REDIS_URL_NODE_01) {
    throw new Error('Missing REDIS_URL_NODE_01 environment.')
  }
}

const prodConfig = {
  production: true,
  environment: process.env.ENVIRONMENT,
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  nationalRegistry: {
    url: process.env.NATIONAL_REGISTRY_URL,
    username: process.env.NATIONAL_REGISTRY_USERNAME,
    password: process.env.NATIONAL_REGISTRY_PASSWORD,
    xroad: {
      basePath: process.env.XROAD_BASE_PATH_WITH_ENV,
      memberCode: process.env.XROAD_TJODSKRA_MEMBER_CODE,
      apiPath: process.env.XROAD_TJODSKRA_API_PATH,
      clientId: process.env.XROAD_TJODSKRA_CLIENT_ID,
      memberClass: XRoadMemberClass.GovernmentInstitution,
    },
  },
  airlineApiKeys: {
    [Airlines.icelandair]: process.env.ICELANDAIR_API_KEY,
    [Airlines.ernir]: process.env.ERNIR_API_KEY,
    [Airlines.norlandair]: process.env.NORLANDAIR_API_KEY,
  },
  redis: {
    urls: [process.env.REDIS_URL_NODE_01!],
  },
  baseUrl: process.env.BASE_URL,
  identityServerAuth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '@vegagerdin.is',
  },
  idsTokenCookieName: process.env.IDS_COOKIE_NAME ?? 'next-auth.session-token',
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
