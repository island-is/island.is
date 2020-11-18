// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

export const environment = {
  production: false,
  sentryDsn: process.env.SENTRY_DSN,
  contentful: {
    space: process.env.CONTENTFUL_SPACE,
    managementAccessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
    environment: process.env.CONTENTFUL_ENVIRONMENT,
  },
}
