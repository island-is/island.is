export default {
  production: false,
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  nationalRegistry: {
    url: 'https://skeyti.advania.is/ords/slrv/registry/v1.0',
    username: 'si_flugfargjold',
    password: process.env.NATIONAL_REGISTRY_PASSWORD,
  },
  airlineApiKeys: {
    icelandair: 'icelandair',
    ernir: 'ernir',
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
