export default {
  production: true,
  auth: {
    issuer: process.env.IDS_ISSUER,
    jwksUri: process.env.JWKS_URI,
  },
}
