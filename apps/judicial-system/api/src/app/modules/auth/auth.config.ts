import { defineConfig } from '@island.is/nest/config'

export const authModuleConfig = defineConfig({
  name: 'AuthModule',
  load: (env) => ({
    scope: env.required('AUTH_IDS_SCOPE', 'openid profile'),
    clientId: env.required(
      'AUTH_IDS_CLIENT_ID',
      '@rettarvorslugatt.island.is/web',
    ),
    domain: env.required(
      'AUTH_IDS_DOMAIN',
      'https://identity-server.dev01.devland.is',
    ),
    clientSecret: env.required('AUTH_IDS_SECRET', ''),
    redirectUri: env.required(
      'AUTH_IDS_REDIRECT_URI',
      'http://localhost:4200/api/auth/callback/identity-server',
    ),
    jwksEndpoint: env.required(
      'AUTH_JWKS_ENDPOINT',
      '.well-known/openid-configuration/jwks',
    ),
    allowAuthBypass: env.required('ALLOW_AUTH_BYPASS', 'true') === 'true',
  }),
})
