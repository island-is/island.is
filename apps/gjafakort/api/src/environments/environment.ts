export const environment = {
  production: false,
  auth: {
    samlEntryPoint:
      process.env.GJAFAKORT_SAML_ENTRYPOINT ||
      'https://innskraning.island.is/?id=ferdagjof.dev',
    audience:
      process.env.GJAFAKORT_AUTH_AUDIENCE ||
      'https://ferdagjof.dev01.devland.is',
    jwtSecret: 'supersecret',
    jwtExpiresInSeconds: 1800,
  },
  applicationUrl: 'http://localhost:4242',
  applicationExchange: 'gjafakort-application-updates-topic',
  ferdalag: {
    url: 'https://island-dot-itb-gagnagrunnur-dev.appspot.com',
    apiKey: process.env.FERDALAG_API_KEY,
  },
}
