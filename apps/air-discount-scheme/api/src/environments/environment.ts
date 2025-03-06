const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  if (!process.env.BACKEND_URL) {
    throw new Error('Missing BACKEND_URL environment.')
  }
}

const devConfig = {
  production: false,
  accessGroups: {
    developers: process.env.DEVELOPERS,
    admins: process.env.ADMINS,
  },
  identityServerAuth: {
    issuer: 'https://innskra.dev01.devland.is',
    audience: '@vegagerdin.is',
  },
  auth: {
    audience: '@vegagerdin.is',
    jwtSecret: 'securesecret',
  },
  idsTokenCookieName: 'next-auth.session-token',
  backendUrl: 'http://localhost:4248',
}

const prodConfig = {
  production: true,
  accessGroups: {
    developers: process.env.DEVELOPERS,
    admins: process.env.ADMINS,
  },
  identityServerAuth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '@vegagerdin.is',
  },
  auth: {
    audience: process.env.AUTH_AUDIENCE,
    jwtSecret: process.env.AUTH_JWT_SECRET,
  },
  idsTokenCookieName: '__Secure-next-auth.session-token',
  backendUrl: process.env.BACKEND_URL ?? 'http://localhost:4248',
}

export default isProd ? prodConfig : devConfig
