import { defineConfig } from '@island.is/nest/config'

export const appModuleConfig = defineConfig({
  name: 'AppModule',
  load: (env) => ({
    backendAccessToken: env.required(
      'BACKEND_ACCESS_TOKEN',
      'secret-backend-api-token',
    ),
    backendUrl: env.required('BACKEND_URL', 'http://localhost:3380'),
    timeToLiveMinutes: env.requiredJSON('TIME_TO_LIVE_MINUTES', 1440),
  }),
})
