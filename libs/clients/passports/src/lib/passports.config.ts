import { defineConfig } from '@island.is/nest/config'
import { NationalRegistryScope } from '@island.is/auth/scopes'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
    scope: z.array(z.string()),
  }),
})

export const PassportsClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'PassportsClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_PASSPORT_LICENSE_PATH',
        'IS-DEV/GOV/10001/SKRA-Cloud-Protected/Forskraning-V1',
      ),
      fetch: {
        timeout: 10000,
        scope: [
          NationalRegistryScope.individuals,

          // TODO: Add back in when ready.
          // NationalRegistryScope.passport,
        ],
      },
    }
  },
})
