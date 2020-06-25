const TEN_MINUTES = 10 * 60

export default {
  production: false,
  sentry: {
    dsn: '',
  },
  auth: {
    samlEntryPoint: 'https://innskraning.island.is/?id=ferdagjof.local',
    audience: 'localhost:4200',
    jwtSecret: 'securesecret',
  },
  applicationUrl: 'http://localhost:4242',
  ferdalag: {
    url: 'https://island-dev-dot-itb-gagnagrunnur-dev.appspot.com',
    apiKey: process.env.FERDALAG_API_KEY,
    ttl: TEN_MINUTES,
  },
  rsk: {
    url: 'https://thjonusta-s.rsk.is/api',
    username: 'rf_api_island.is',
    password: process.env.RSK_API_PASSWORD,
    ttl: TEN_MINUTES,
  },
  redis: {
    urls: [
      'localhost:7000',
      'localhost:7001',
      'localhost:7002',
      'localhost:7003',
      'localhost:7004',
      'localhost:7005',
    ],
  },
  yay: {
    url: 'https://dev-serviceapi.yay.is',
    apiKey: process.env.YAY_API_KEY,
    secretKey: process.env.YAY_SECRET_KEY,
  },
}
