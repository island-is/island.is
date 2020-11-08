// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

export default {
  production: false,
  identityServer: {
    IDENTITY_SERVER_ISSUER_URL:
      window.location.origin === 'https://beta.minarsidur.island.is'
        ? 'http://innskra.island.is'
        : 'https://identity-server.dev01.devland.is',
  },
  sentry: {
    dsn:
      'https://3c45a55273774b91a897b85e0a1243d1@o406638.ingest.sentry.io/5501494',
  },
}
