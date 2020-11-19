export default {
  production: true,
  auth: {
    samlEntryPoint: process.env.SAML_ENTRY_POINT,
    audience: process.env.AUTH_AUDIENCE,
    jwtSecret: process.env.AUTH_JWT_SECRET,
    allowAuthBypass: process.env.ALLOW_AUTH_BYPASS,
  },
  backendUrl: process.env.BACKEND_URL,
}
