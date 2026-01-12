import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'
import { VehiclesScope } from '@island.is/auth/scopes'

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
        timeout: 120000,
      },
      scope: [VehiclesScope.vehicle], // TODO: Change to new scope when it has been created
    }
  },
})
