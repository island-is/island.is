import { getStaticEnv } from '@island.is/utils/environment'

export default {
  production: true,
  identityServer: {
    IDENTITY_SERVER_ISSUER_URL: getStaticEnv(
      'SI_PUBLIC_IDENTITY_SERVER_ISSUER_URL',
    ),
  },
  sentry: {
    dsn:
      'https://3c45a55273774b91a897b85e0a1243d1@o406638.ingest.sentry.io/5501494',
  },
  documentProviderAdmins: process.env.NX_DOCUMENT_PROVIDER_ADMINS || '',
  featureFlagSdkKey: getStaticEnv('SI_PUBLIC_CONFIGCAT_SDK_KEY'),
}
