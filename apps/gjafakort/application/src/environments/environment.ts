const devConfig = {
  production: false,
  sentry: {
    dsn: '',
  },
}

const prodConfig = {
  production: true,
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
