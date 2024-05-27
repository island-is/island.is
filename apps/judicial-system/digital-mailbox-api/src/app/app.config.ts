import { defineConfig } from '@island.is/nest/config'

export const digitalMailboxModuleConfig = defineConfig({
  name: 'DigitalMailboxModule',
  load: (env) => ({
    scope: env.required('AUTH_IDS_SCOPE', 'openid profile'),
    clientId: env.required('AUTH_IDS_CLIENT_ID', '@island.is'),
    issuer: env.required(
      'IDENTITY_SERVER_ISSUER_URL',
      'https://innskra.island.is',
    ),
    backendUrl: env.required('BACKEND_URL', 'http://localhost:3344'),
    secretToken: env.required(
      'BACKEND_ACCESS_TOKEN',
      'secret-backend-api-token',
    ),
  }),
})
