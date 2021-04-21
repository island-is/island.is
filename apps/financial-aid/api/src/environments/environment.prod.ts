export default {
  production: true,
  auth: {
    samlEntryPoint: process.env.SAML_ENTRY_POINT,
    audience: process.env.AUTH_AUDIENCE,
    allowAuthBypass: process.env.ALLOW_AUTH_BYPASS === 'true',
    jwtSecret: process.env.AUTH_JWT_SECRET,
    secretToken: process.env.SECRET_TOKEN,
  },
  backend: {
    url: process.env.BACKEND_URL,
  },
}
