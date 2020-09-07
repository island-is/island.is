export default {
  production: true,
  environment: process.env.ENVIRONMENT,
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  nationalRegistry: {
    url: 'https://skeyti.advania.is/ords/slrv/registry/v1.0',
    username: 'si_flugfargjold',
    password: process.env.NATIONAL_REGISTRY_PASSWORD,
  },
  airlineApiKeys: {
    icelandair: process.env.ICELANDAIR_API_KEY,
    ernir: process.env.ERNIR_API_KEY,
  },
  redis: {
    urls: [process.env.REDIS_URL_NODE_01],
  },
}
