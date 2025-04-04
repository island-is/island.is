const devConfig = {
  production: false,
  port: 3376,
  auth: {
    audience: '@island.is/auth',
    issuer:
      process.env.IDENTITY_SERVER_ISSUER_URL ??
      'https://identity-server.dev01.devland.is',
  },
}

const prodConfig = {
  production: true,
  port: 3333,
  auth: {
    audience: '@island.is/auth',
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL ?? '',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
