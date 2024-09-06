const devConfig = {
  production: false,
  auth: {
    audience: '@island.is',
    issuer:
      process.env.IDENTITY_SERVER_ISSUER_URL ??
      'https://identity-server.dev01.devland.is',
  },
}

const prodConfig = {
  production: true,
  auth: {
    audience: '@island.is',
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL ?? '',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
