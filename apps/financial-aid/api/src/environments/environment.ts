if (process.env.NODE_ENV === 'production') {
  if (!process.env.BACKEND_URL) {
    throw new Error('Missing BACKEND_URL environment.')
  }
}

const prodConfig = {
  production: true,
  identityServerAuth: {
    issuer: process.env.IDENTITY_SERVER_DOMAIN ?? '',
    audience: '@samband.is',
  },
  backend: {
    url: process.env.BACKEND_URL,
  },
}

const devConfig = {
  production: false,
  identityServerAuth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '@samband.is',
  },
  backend: {
    url: 'http://localhost:3344',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
