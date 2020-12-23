export const environment = {
  production: true,
  sentryDsn: process.env.SENTRY_DSN,
  editButton: {
    enable: process.env.CONTENTFUL_EDIT_BUTTON_ENABLE === 'true',
    clientSpace: process.env.CONTENTFUL_SPACE,
  },
}
