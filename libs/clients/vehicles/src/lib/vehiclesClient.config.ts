import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'
import { ApiScope } from '@island.is/auth/scopes'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
  }),
  scope: z.array(z.string()),
})

export const VehiclesClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'VehiclesClient',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_VEHICLES_PATH',
        'IS-DEV/GOV/10017/Samgongustofa-Protected/Mitt-Svaedi-V1',
      ),
      fetch: {
        timeout: 10000,
      },
      scope: ['@samgongustofa.is/vehicle-search'],
    }
  },
})
