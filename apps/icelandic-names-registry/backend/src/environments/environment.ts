export default {
  production: false,
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '@island.is',
    jwksUri:
      'https://identity-server.dev01.devland.is/.well-known/openid-configuration/jwks',
  },
  allowedNationalIds:
    process.env.ICELANDIC_NAMES_REGISTRY_ALLOWED_NATIONAL_IDS ?? '',
}
