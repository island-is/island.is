export default {
  production: true,
  auth: {
    samlEntryPoint: process.env.SAML_ENTRY_POINT,
    audience: process.env.AUTH_AUDIENCE,
    jwtSecret: process.env.AUTH_JWT_SECRET,
  },
  applicationUrl: process.env.APPLICATION_URL,
  applicationExchange: 'gjafakort-application-updates-topic',
  ferdalag: {
    url: process.env.FERDALAG_URL,
    apiKey: process.env.FERDALAG_API_KEY,
  },
}
