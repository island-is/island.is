export default {
  production: true,
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  accessGroups: {
    developers: process.env.DEVELOPERS,
    admins: process.env.ADMINS,
  },
  auth: {
    samlEntryPoint: process.env.SAML_ENTRY_POINT,
    audience: process.env.AUTH_AUDIENCE,
    jwtSecret: process.env.AUTH_JWT_SECRET,
  },
  backendUrl: process.env.BACKEND_URL,
}
