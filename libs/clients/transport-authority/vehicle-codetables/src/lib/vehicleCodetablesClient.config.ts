import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadPath: z.string(),
})

export const VehicleCodetablesClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'VehicleCodetablesClient',
  schema,
  load(env) {
    return {
      xroadPath: env.required(
        'XROAD_VEHICLE_CODETABLES_PATH',
        'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-Codetables-V1',
      ),
    }
  },
})
