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

export const VehiclesMileageClientConfig = defineConfig<z.infer<typeof schema>>(
  {
    name: 'VehiclesMileageClient',
    schema,
    load(env) {
      return {
        xRoadServicePath: env.required(
          'XROAD_VEHICLES_MILEAGE_PATH',
          'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-Mileagereading-V1',
        ),
        fetch: {
          timeout: 30000,
        },
        scope: [VehiclesScope.vehicle],
      }
    },
  },
)
