const devConfig = {
  production: false,
  sentryDsn: process.env.SENTRY_DSN,
}

const prodConfig = {
  production: true,
  sentryDsn: process.env.SENTRY_DSN,
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
