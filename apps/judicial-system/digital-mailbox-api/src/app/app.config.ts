import { defineConfig } from '@island.is/nest/config'

export const digitalMailboxModuleConfig = defineConfig({
  name: 'DigitalMailboxModule',
  load: (env) => ({
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
