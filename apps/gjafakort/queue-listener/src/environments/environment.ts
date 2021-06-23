const devConfig = {
  production: false,
  applicationUrl: 'http://localhost:4242',
  sentry: {
    dsn: '',
  },
  ferdalag: {
    url: 'https://island-dev-dot-itb-gagnagrunnur-dev.appspot.com',
    apiKey: process.env.FERDALAG_API_KEY,
  },
  yay: {
    url: 'https://dev-serviceapi.yay.is',
    apiKey: process.env.YAY_API_KEY,
    secretKey: process.env.YAY_SECRET_KEY,
  },
}

const prodConfig = {
  production: true,
  applicationUrl: process.env.APPLICATION_URL,
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  ferdalag: {
    url: process.env.FERDALAG_URL,
    apiKey: process.env.FERDALAG_API_KEY,
  },
  yay: {
    url: process.env.YAY_URL,
    apiKey: process.env.YAY_API_KEY,
    secretKey: process.env.YAY_SECRET_KEY,
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
