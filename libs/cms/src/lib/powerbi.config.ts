import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  fiskistofaPowerBiClientId: z.string(),
  fiskistofaPowerBiClientSecret: z.string(),
  fiskistofaPowerBiTenantId: z.string(),
})

export const PowerBiConfig = defineConfig({
  name: 'PowerBi',
  schema,
  load(env) {
    return {
      fiskistofaPowerBiClientId: env.required('FISKISTOFA_POWERBI_CLIENT_ID'),
      fiskistofaPowerBiClientSecret: env.required(
        'FISKISTOFA_POWERBI_CLIENT_SECRET',
      ),
      fiskistofaPowerBiTenantId: env.required('FISKISTOFA_POWERBI_TENANT_ID'),
    }
  },
})
