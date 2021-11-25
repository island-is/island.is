import { Airlines } from '@island.is/air-discount-scheme/consts'

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
  },
  airlineApiKeys: {
    [Airlines.icelandair]: process.env.ICELANDAIR_API_KEY,
    [Airlines.ernir]: process.env.ERNIR_API_KEY,
    [Airlines.norlandair]: process.env.NORLANDAIR_API_KEY,
  },
  redis: {
    urls: [process.env.REDIS_URL_NODE_01!],
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
