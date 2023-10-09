import { defineConfig } from '@island.is/nest/config'

export const defenderModuleConfig = defineConfig({
  name: 'DefenderModule',
  load: (env) => ({
    lawyerRegistryAPI: env.required(
      'LAWYERS_ICELAND_API_KEY',
      'https://lmfi.is/api/',
    ),
    lawyerRegistryAPIKey: env.required('LAWYERS_ICELAND_API_KEY'),
  }),
})
