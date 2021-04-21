export default {
  production: true,
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '',
    jwksUri: process.env.IDENTITY_SERVER_JWKS_URI,
  },
  allowedNationalIds: process.env.ALLOWED_NATIONAL_IDS ?? '',
}
