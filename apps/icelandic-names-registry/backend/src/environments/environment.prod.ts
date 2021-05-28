export default {
  production: true,
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL ?? '',
    audience: '',
  },
  allowedNationalIds: process.env.ALLOWED_NATIONAL_IDS ?? '',
}
