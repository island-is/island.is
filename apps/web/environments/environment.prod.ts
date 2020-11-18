export const environment = {
  production: true,
  sentryDsn: process.env.SENTRY_DSN,
  contentful: {
    space: process.env.CONTENTFUL_SPACE,
    managementAccessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
    environment: process.env.CONTENTFUL_ENVIRONMENT,
  },
}
