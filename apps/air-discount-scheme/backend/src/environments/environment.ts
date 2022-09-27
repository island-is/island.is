import { Airlines } from '@island.is/air-discount-scheme/consts'

const isProd = process.env.NODE_ENV === 'production'

const devConfig = {
  production: false,
  environment: 'local',
  nationalRegistry: {
    url: process.env.NATIONAL_REGISTRY_URL,
    username: process.env.NATIONAL_REGISTRY_USERNAME,
    password: process.env.NATIONAL_REGISTRY_PASSWORD,
    authMiddlewareOptions: {
      forwardUserInfo: false,
      tokenExchangeOptions: {
        issuer: 'https://identity-server.dev01.devland.is',
        clientId: '@vegagerdin.is/clients/air-discount-scheme',
        clientSecret: process.env.VEGAGERDIN_IDS_CLIENTS_SECRET,
        scope: 'openid profile @skra.is/individuals',
        requestActorToken: false,
      },
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
  idsTokenCookieName: 'next-auth.session-token',
}

if (isProd) {
  if (!process.env.REDIS_URL_NODE_01) {
    throw new Error('Missing REDIS_URL_NODE_01 environment.')
  }
}

const prodConfig = {
  production: true,
  environment: process.env.ENVIRONMENT,
  nationalRegistry: {
    url: process.env.NATIONAL_REGISTRY_URL,
    username: process.env.NATIONAL_REGISTRY_USERNAME,
    password: process.env.NATIONAL_REGISTRY_PASSWORD,
    authMiddlewareOptions: {
      forwardUserInfo: false,
      tokenExchangeOptions: {
        issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
        clientId: '@vegagerdin.is/clients/air-discount-scheme',
        clientSecret: process.env.VEGAGERDIN_IDS_CLIENTS_SECRET,
        scope: 'openid profile @skra.is/individuals',
        requestActorToken: false,
      },
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
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL as string,
    audience: '@vegagerdin.is',
  },
  idsTokenCookieName: '__Secure-next-auth.session-token',
}

export default isProd ? prodConfig : devConfig
