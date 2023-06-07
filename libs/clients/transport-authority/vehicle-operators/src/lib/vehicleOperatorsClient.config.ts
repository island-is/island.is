import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'
import { VehiclesScope } from '@island.is/auth/scopes'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
})

export const VehicleOperatorsClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'VehicleOperatorsClient',
  schema,
  load(env) {
    return {
      xroadPath: env.required(
        'XROAD_VEHICLE_OPERATORS_PATH',
        'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-Operators-V3',
      ),
      scope: [VehiclesScope.vehicle], // TODO: Change to new scope when it has been created
    }
  },
})
