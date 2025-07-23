import { defineConfig } from '@island.is/nest/config'

export const lawyerRegistryConfig = defineConfig({
  name: 'LawyerRegistryModule',
  load: (env) => ({
    lawyerRegistryAPI: 'https://lmfi.is/api',
    lawyerRegistryAPIKey: env.required('LAWYERS_ICELAND_API_KEY'),
  }),
})
