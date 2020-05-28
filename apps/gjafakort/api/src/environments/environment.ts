export default {
  production: false,
  auth: {
    samlEntryPoint: 'https://innskraning.island.is/?id=ferdagjof.local',
    audience: 'localhost:4200',
    jwtSecret: 'securesecret',
  },
  applicationUrl: 'http://localhost:4242',
  applicationExchange: 'gjafakort-application-updates-topic',
  ferdalag: {
    url: 'https://island-dot-itb-gagnagrunnur-dev.appspot.com',
    apiKey: process.env.FERDALAG_API_KEY,
  },
}
