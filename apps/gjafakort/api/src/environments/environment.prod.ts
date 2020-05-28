export const environment = {
  production: true,
  auth: {
    samlEntryPoint: process.env.SAML_ENTRY_POINT,
    audience: process.env.AUTH_AUDIENCE,
    jwtSecret: process.env.AUTH_JWT_SECRET,
    jwtExpiresInSeconds: process.env.AUTH_JWT_EXPIRES_IN_SECONDS,
  },
  applicationUrl: process.env.APPLICATION_URL,
  applicationExchange: 'gjafakort-application-updates-topic',
}
