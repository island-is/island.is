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
    url: 'https://island-dev-dot-itb-gagnagrunnur-dev.appspot.com',
    apiKey: process.env.FERDALAG_API_KEY,
  },
  rsk: {
    url: 'https://thjonusta-s.rsk.is/api',
    username: 'rf_api_island.is',
    password: process.env.RSK_API_PASSWORD,
  },
  contentful: {
    accessToken: 'dE_D4LxgEJTKOJ2kteFf1c3yPInyod7wW4KGHZvigd8',
    space: 'bcz5dess12yp',
  },
}
