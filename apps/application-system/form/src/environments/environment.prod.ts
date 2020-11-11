export default {
  production: true,
  identityServer: {
    baseUrl: 'https://identity-server.dev01.devland.is',
  },
  baseApiUrl: process.env.API_URL,
  identityServer: {
    authority: process.env.IDENTITY_SERVER_ISSUER_URL,
  },
}
