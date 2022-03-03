import * as z from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  xRoadProviderId: z.string(),
})

export const CompanyRegistryConfig = defineConfig<z.infer<typeof schema>>({
  name: 'CompanyRegistryClient',
  schema,
  load(env) {
    return {
      xRoadProviderId: env.required(
        'COMPANY_REGISTRY_XROAD_PROVIDER_ID',
        'IS-DEV/GOV/10006/Skatturinn/ft-v1',
      ),
    }
  },
})
