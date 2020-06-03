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
  rsk: {
    url: process.env.RSK_URL,
    username: process.env.RSK_USERNAME,
    password: process.env.RSK_API_PASSWORD,
  },
}
