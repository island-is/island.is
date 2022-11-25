import { serviceSetup as adsApiSetup } from '../../infra/api'
import { getConfig } from '../../../../../infra/src/dsl/types/helpers'

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
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '@vegagerdin.is',
  },
  auth: {
    audience: '@vegagerdin.is',
    jwtSecret: 'securesecret',
  },
  idsTokenCookieName: 'next-auth.session-token',
  backendUrl: 'http://localhost:4248',
}

const config = getConfig(adsApiSetup)

const prodConfig = {
  production: true,
  accessGroups: {
    developers: config.env('DEVELOPERS'),
    admins: config.env('ADMINS'),
  },
  identityServerAuth: {
    issuer: config.env('IDENTITY_SERVER_ISSUER_URL'),
    audience: '@vegagerdin.is',
  },
  auth: {
    audience: config.env('AUTH_AUDIENCE'),
    jwtSecret: config.env('AUTH_JWT_SECRET'),
  },
  idsTokenCookieName: '__Secure-next-auth.session-token',
  backendUrl: config.env('BACKEND_URL') ?? 'http://localhost:4248',
}

export default isProd ? prodConfig : devConfig
