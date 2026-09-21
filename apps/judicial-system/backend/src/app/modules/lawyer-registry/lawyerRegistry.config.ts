import { defineConfig } from '@island.is/nest/config'

export const lawyerRegistryConfig = defineConfig({
  name: 'LawyerRegistryModule',
  load: (env) => ({
    lawyerRegistryAPI: 'https://lmfi.is/api',
    lawyerRegistryAPIKey: env.required('LAWYERS_ICELAND_API_KEY'),
    // Keep the e2e test lawyers in the registry when it is replaced from LMFÍ.
    // Never true in production - see testLawyers.ts.
    includeTestLawyers:
      env.required('LAWYER_REGISTRY_INCLUDE_TEST_LAWYERS', 'true') === 'true',
  }),
})
