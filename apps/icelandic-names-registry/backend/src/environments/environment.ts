export default {
  production: false,
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '',
    jwksUri:
      'https://identity-server.dev01.devland.is/.well-known/openid-configuration/jwks',
  },
  allowedNationalIds: process.env.ALLOWED_NATIONAL_IDS ?? '',
}
