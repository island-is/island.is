export const environment = {
  production: true,
  auth: {
    samlEntryPoint: 'https://innskraning.island.is/?id=ferdagjof.prod',
    audience: process.env.AUTH_AUDIENCE,
    jwtSecret: process.env.AUTH_JWT_SECRET,
    jwtExpiresInSeconds: process.env.AUTH_JWT_EXPIRES_IN_SECONDS,
  },
  applicationUrl: process.env.APPLICATION_URL,
  applicationExchange: 'gjafakort-application-updates-topic',
  ferdalag: {
    url: process.env.FERDALAG_URL,
    apiKey: process.env.FERDALAG_API_KEY,
  },
}
