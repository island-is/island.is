declare global {
  interface Window {
    ENV: {
      PUBLIC_IDENTITY_SERVER_ISSUER_URL?: string
    }
  }
}

export default {
  production: true,
  baseApiUrl: window.location.origin,
  identityServer: {
    authority: window.ENV.PUBLIC_IDENTITY_SERVER_ISSUER_URL,
  },
  sentry: {
    dsn:
      'https://22093678b2b24a0cad25111c1806a8d7@o406638.ingest.sentry.io/5530607',
  },
}
