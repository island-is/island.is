import { defineConfig } from '@island.is/nest/config'

export const lawyersModuleConfig = defineConfig({
  name: 'LawyersModule',
  load: (env) => ({
    lawyerRegistryAPI: 'https://lmfi.is/api',
    lawyerRegistryAPIKey: env.required('LAWYERS_ICELAND_API_KEY'),
    backendUrl: env.required('BACKEND_URL', 'http://localhost:3344'),
  }),
})
