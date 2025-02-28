import { Airlines } from '@island.is/air-discount-scheme/consts'

const isProd = process.env.NODE_ENV === 'production'

const devConfig = {
  production: false,
  environment: 'local',
  airlineApiKeys: {
    [Airlines.icelandair]: Airlines.icelandair,
    [Airlines.ernir]: Airlines.ernir,
    [Airlines.norlandair]: Airlines.norlandair,
    [Airlines.myflug]: Airlines.myflug,
  },
  redis: {
    urls: [
      'localhost:7010',
      'localhost:7011',
      'localhost:7012',
      'localhost:7013',
      'localhost:7014',
      'localhost:7015',
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
  airlineApiKeys: {
    [Airlines.icelandair]: process.env.ICELANDAIR_API_KEY,
    [Airlines.ernir]: process.env.ERNIR_API_KEY,
    [Airlines.norlandair]: process.env.NORLANDAIR_API_KEY,
    [Airlines.myflug]: process.env.MYFLUG_API_KEY,
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
