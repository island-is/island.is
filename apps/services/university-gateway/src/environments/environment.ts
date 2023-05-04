const audience = ['@island.is']

export const devConfig = {
  production: false,
  port: 3379,
  auth: {
    audience,
    issuer: 'https://identity-server.dev01.devland.is',
  },
}

export const prodConfig = {
  production: true,
  port: 3333,
  auth: {
    audience,
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL!,
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
