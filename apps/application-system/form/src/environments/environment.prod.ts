export default {
  production: true,
  baseApiUrl: process.env.API_URL,
  identityServer: {
    authority: process.env.IDENTITY_SERVER_ISSUER_URL,
  },
}
