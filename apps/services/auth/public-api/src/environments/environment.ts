const devConfig = {
  production: false,
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '@island.is',
  },
  port: 3370,
}

const prodConfig = {
  production: true,
  auth: {
    audience: '@island.is',
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL!,
  },
  port: 3333,
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
