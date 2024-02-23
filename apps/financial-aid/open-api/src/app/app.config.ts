import { defineConfig } from '@island.is/nest/config'

export default defineConfig({
  name: 'AppModule',
  load: (env) => ({
    backend: {
      url: env.required('BACKEND_URL', 'http://localhost:3344'),
    },
  }),
})
