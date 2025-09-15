export default {
  production: process.env.NODE_ENV === 'production',
  auth: {
    issuer:
      process.env.IDENTITY_SERVER_ISSUER_URL ??
      'https://identity-server.dev01.devland.is',
    audience: '@admin.island.is',
  },
}
