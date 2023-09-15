import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'
import { VehiclesScope } from '@island.is/auth/scopes'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
})

export const VehiclePrintingClientConfig = defineConfig<z.infer<typeof schema>>(
  {
    name: 'VehiclePrintingClient',
    schema,
    load(env) {
      return {
        xroadPath: env.required(
          'XROAD_VEHICLE_PRINTING_PATH',
          'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-Printing-V1',
        ),
        scope: [VehiclesScope.vehicle], // TODO: Change to new scope when it has been created
      }
    },
  },
)
