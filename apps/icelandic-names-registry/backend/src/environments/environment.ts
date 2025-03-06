const devConfig = {
  production: false,
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '',
  },
}

const prodConfig = {
  production: true,
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL ?? '',
    audience: '',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
