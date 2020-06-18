export default {
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
