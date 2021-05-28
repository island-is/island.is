export default {
  production: true,
  auth: {
    audience: '@identityserver.api',
    issuer: process.env.IDS_ISSUER,
  },
}
