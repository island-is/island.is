import baseEnvironment from './environment'

const prodEnvironment: typeof baseEnvironment = {
  production: true,
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL ?? '',
    audience: '',
    jwksUri: process.env.IDENTITY_SERVER_JWKS_URI ?? '',
  },
  allowedNationalIds: process.env.ALLOWED_NATIONAL_IDS ?? '',
}

export default prodEnvironment
