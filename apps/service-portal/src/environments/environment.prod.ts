export default {
  production: true,
  identityServer: {
    IDENTITY_SERVER_ISSUER_URL:
      window.location.origin === 'https://beta.staging01.devland.is'
        ? 'https://identity-server.staging01.devland.is'
        : window.location.origin === 'https://island.is'
        ? 'https://innskra.island.is'
        : 'https://identity-server.dev01.devland.is',
  },
  sentry: {
    dsn:
      'https://3c45a55273774b91a897b85e0a1243d1@o406638.ingest.sentry.io/5501494',
  },
  featureFlags: {
    applications: false,
    documents: true,
    settings: true,
    finance: true,
    family: true,
    health: false,
    education: false,
    delegation: false,
    assets: false,
    drivingLicense: false,
    documentProvider: false,
  },
}
