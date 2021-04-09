import { getStaticEnv } from '@island.is/utils/environment'

export default {
  production: true,
  identityServer: {
    IDENTITY_SERVER_ISSUER_URL: getStaticEnv(
      'SI_PUBLIC_IDENTITY_SERVER_ISSUER_URL',
    ),
  },
}
