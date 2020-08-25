export default {
  production: true,
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  auth: {
    samlEntryPoint: process.env.SAML_ENTRY_POINT,
    audience: process.env.AUTH_AUDIENCE,
    jwtSecret: process.env.AUTH_JWT_SECRET,
  },
  applicationUrl: process.env.APPLICATION_URL,
  ferdalag: {
    url: process.env.FERDALAG_URL,
    apiKey: process.env.FERDALAG_API_KEY,
    ttl: process.env.CACHE_TIME_TO_LIVE,
  },
  rsk: {
    url: process.env.RSK_URL,
    username: process.env.RSK_API_USERNAME,
    password: process.env.RSK_API_PASSWORD,
    ttl: process.env.CACHE_TIME_TO_LIVE,
  },
  redis: {
    urls: [process.env.REDIS_URL_NODE_01],
  },
  yay: {
    url: process.env.YAY_URL,
    apiKey: process.env.YAY_API_KEY,
    secretKey: process.env.YAY_SECRET_KEY,
  },
  nova: {
    url: process.env.NOVA_URL,
    username: process.env.NOVA_USERNAME,
    password: process.env.NOVA_PASSWORD,
  },
}
