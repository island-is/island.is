import { sdkKeys } from '@island.is/feature-flags'

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
  documentProviderAdmins: process.env.NX_DOCUMENT_PROVIDER_ADMINS || '',
  featureFlagSdkKey:
    window.location.origin === 'https://beta.staging01.devland.is'
      ? sdkKeys.staging
      : window.location.origin === 'https://island.is'
      ? sdkKeys.production
      : sdkKeys.development,
}
