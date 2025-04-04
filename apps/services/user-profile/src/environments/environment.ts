const devConfig = {
  production: false,
  port: 3366,
  islykillConfig: {
    cert: process.env.ISLYKILL_CERT ?? '',
    basePath: process.env.ISLYKILL_SERVICE_BASEPATH ?? '',
    passphrase: process.env.ISLYKILL_SERVICE_PASSPHRASE ?? '',
  },
  auth: {
    issuer:
      process.env.IDENTITY_SERVER_ISSUER_URL ??
      'https://identity-server.dev01.devland.is',
    audience: ['@island.is', '@admin.island.is'],
  },
}

const prodConfig = {
  production: true,
  port: 3333,
  islykillConfig: {
    cert: process.env.ISLYKILL_CERT ?? '',
    basePath: process.env.ISLYKILL_SERVICE_BASEPATH ?? '',
    passphrase: process.env.ISLYKILL_SERVICE_PASSPHRASE ?? '',
  },
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL ?? '',
    audience: ['@island.is', '@admin.island.is'],
  },
}

export default process.env.PROD_MODE === 'true' ||
process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig
