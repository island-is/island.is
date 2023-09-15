import { defineConfig } from '@island.is/nest/config'

export default defineConfig({
  name: 'AppModule',
  load: (env) => ({
    errorReportUrl: env.required('ERROR_EVENT_URL', ''),
    backend: {
      accessToken: env.required(
        'BACKEND_ACCESS_TOKEN',
        'secret-backend-api-token',
      ),
      url: env.required('BACKEND_URL', 'http://localhost:3344'),
    },
  }),
})
