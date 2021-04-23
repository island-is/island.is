import { AuthConfig } from '@island.is/auth-nest-tools'

export default {
  production: false,
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '',
    jwksUri:
      'https://identity-server.dev01.devland.is/.well-known/openid-configuration/jwks',
  } as AuthConfig,
  allowedNationalIds: process.env.ALLOWED_NATIONAL_IDS ?? '',
}
