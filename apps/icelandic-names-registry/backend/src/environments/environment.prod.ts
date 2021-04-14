export default {
  production: true,
  identityServer: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '@island.is',
    jwksUri: process.env.IDENTITY_SERVER_JWKS_URI,
  },
  allowedNationalIds:
    process.env.ICELANDIC_NAMES_REGISTRY_ALLOWED_NATIONAL_IDS ?? '',
}
