export default {
  production: true,
  identityServer: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '',
    jwksUri: process.env.IDENTITY_SERVER_JWKS_URI,
  },
  redis: {
    urls: [process.env.REDIS_URL_NODE_01],
  },
}
