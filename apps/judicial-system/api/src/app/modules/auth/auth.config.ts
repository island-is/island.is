import { defineConfig } from '@island.is/nest/config'

export const authModuleConfig = defineConfig({
  name: 'AuthModule',
  load: (env) => ({
    id: env.optional('AUTH_IDS_ID', 'judicial-system.local'),
    name: env.optional('AUTH_IDS_NAME', 'Iceland authentication service'),
    scope: env.required('IDS_SCOPE', 'openid profile'),
    clientId: env.required('IDS_CLIENT_ID', '@rettarvorslugatt.island.is/web'),
    domain: env.required(
      'AUTH_IDS_DOMAIN',
      'https://identity-server.dev01.devland.is',
    ),
    clientSecret: env.required('AUTH_IDS_SECRET', ''),
    redirectUri: env.required(
      'AUTH_IDS_REDIRECT_URI',
      'http://localhost:4200/api/auth/callback/identity-server',
    ),
  }),
})
