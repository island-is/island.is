import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'
import { VehiclesScope } from '@island.is/auth/scopes'

const schema = z.object({
  xroadPath: z.string(),
  scope: z.array(z.string()),
  fetchTimeout: z.number().int(),
})

export const VehiclePlateRenewalClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'VehiclePlateRenewalClient',
  schema,
  load(env) {
    return {
      xroadPath: env.required(
        'XROAD_VEHICLE_PLATE_RENEWAL_PATH',
        'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-PlateOwnership-V1',
      ),
      scope: [VehiclesScope.vehicle], // TODO: Change to new scope when it has been created
      fetchTimeout:
        env.optionalJSON('XROAD_VEHICLE_PLATE_RENEWAL_TIMEOUT') ?? 30000,
    }
  },
})
