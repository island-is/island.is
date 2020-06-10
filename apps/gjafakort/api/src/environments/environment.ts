const ONE_DAY = 86400

export default {
  production: false,
  auth: {
    samlEntryPoint: 'https://innskraning.island.is/?id=ferdagjof.local',
    audience: 'localhost:4200',
    jwtSecret: 'securesecret',
  },
  applicationUrl: 'http://localhost:4242',
  ferdalag: {
    url: 'https://island-dev-dot-itb-gagnagrunnur-dev.appspot.com',
    apiKey: process.env.FERDALAG_API_KEY,
    ttl: ONE_DAY,
  },
  rsk: {
    url: 'https://thjonusta-s.rsk.is/api',
    username: 'rf_api_island.is',
    password: process.env.RSK_API_PASSWORD,
    ttl: ONE_DAY,
  },
  redis: {
    url: 'localhost',
  },
}
