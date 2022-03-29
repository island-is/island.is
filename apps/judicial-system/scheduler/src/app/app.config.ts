import { defineConfig } from '@island.is/nest/config'

export const appModuleConfig = defineConfig({
  name: 'AppModule',
  load: (env) => ({
    backendAuthToken: env.required(
      'BACKEND_AUTH_TOKEN',
      'secret-backend-api-token',
    ),
    backendUrl: env.required('BACKEND_URL', 'http://localhost:3344'),
    timeToLiveMinutes: env.requiredJSON('TIME_TO_Live_MINUTES', 1),
  }),
})
