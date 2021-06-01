const devConfig = {
  production: false,
  auth: {
    audience: '@identityserver.api',
    issuer: 'https://localhost:6001',
  },
  port: 4333,
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.IDS_ISSUER) {
    throw new Error('Missing IDS_ISSUER environment.')
  }
}

const prodConfig = {
  production: true,
  auth: {
    audience: '@identityserver.api',
    issuer: process.env.IDS_ISSUER!,
  },
  port: 3333,
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
