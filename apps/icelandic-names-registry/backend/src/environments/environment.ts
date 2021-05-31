export default {
  production: false,
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '',
  },
  allowedNationalIds: process.env.ALLOWED_NATIONAL_IDS ?? '',
}
