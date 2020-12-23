// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

export const environment = {
  production: false,
  sentryDsn: process.env.SENTRY_DSN,
  editButton: {
    enable: process.env.CONTENTFUL_EDIT_BUTTON_ENABLE === 'true',
    clientSpace: process.env.CONTENTFUL_SPACE,
  },
}
