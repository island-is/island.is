import { getStaticEnv } from '@island.is/utils/environment'

const devConfig = {
  production: false,
  baseApiUrl: 'http://localhost:4444',
  identityServer: {
    authority: 'https://identity-server.dev01.devland.is',
  },
  sentry: {
    dsn:
      'https://22093678b2b24a0cad25111c1806a8d7@o406638.ingest.sentry.io/5530607',
  },
}

const prodConfig = {
  production: true,
  baseApiUrl: window.location.origin,
  identityServer: {
    authority: getStaticEnv('SI_PUBLIC_IDENTITY_SERVER_ISSUER_URL'),
  },
  sentry: {
    dsn:
      'https://22093678b2b24a0cad25111c1806a8d7@o406638.ingest.sentry.io/5530607',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
