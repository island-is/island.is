export default {
  production: process.env.NODE_ENV === 'production',
  port: process.env.NODE_ENV === 'production' ? 3333 : 3369,
  auth: {
    issuer:
      process.env.IDENTITY_SERVER_ISSUER_URL ??
      'https://identity-server.dev01.devland.is',
    audience: ['@island.is', '@admin.island.is'],
  },
}
