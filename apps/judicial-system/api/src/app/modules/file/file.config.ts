import { defineConfig } from '@island.is/nest/config'

export const fileModuleConfig = defineConfig({
  name: 'FileModule',
  load: (env) => ({
    backendUrl: env.required('BACKEND_URL', 'http://localhost:3344'),
  }),
})
