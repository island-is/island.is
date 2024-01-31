import { defineConfig } from '@island.is/nest/config'

export default defineConfig({
  name: 'AppModule',
  load: (env) => ({
    errorReportUrl: env.required('ERROR_EVENT_URL', ''),
    backend: {
      url: 'http://localhost:3344',
    },
  }),
})
