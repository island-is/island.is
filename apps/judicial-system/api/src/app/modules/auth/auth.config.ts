import { defineConfig } from '@island.is/nest/config'

export const authModuleConfig = defineConfig({
  name: 'AuthModule',
  load: (env) => ({
    production: env.optional('NODE_ENV') === 'production',
    scope: env.required('AUTH_IDS_SCOPE', 'openid profile offline_access'),
    clientId: env.required(
      'AUTH_IDS_CLIENT_ID',
      '@rettarvorslugatt.island.is/web',
    ),
    issuer: env.required(
      'IDENTITY_SERVER_ISSUER_URL',
      'https://identity-server.dev01.devland.is',
    ),
    clientSecret: env.required('AUTH_IDS_SECRET', ''),
    redirectUri: env.required(
      'AUTH_IDS_REDIRECT_URI',
      'http://localhost:4200/api/auth/callback/identity-server',
    ),
    logoutRedirectUri: env.required(
      'AUTH_IDS_LOGOUT_REDIRECT_URI',
      'http://localhost:4200',
    ),
    allowAuthBypass: env.required('ALLOW_AUTH_BYPASS', 'true') === 'true',
    backendUrl: env.required('BACKEND_URL', 'http://localhost:3344'),
    secretToken: env.required(
      'BACKEND_ACCESS_TOKEN',
      'secret-backend-api-token',
    ),
  }),
})
