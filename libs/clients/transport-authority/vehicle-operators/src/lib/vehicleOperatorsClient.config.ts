import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadBaseUrl: z.string(),
  xroadClientId: z.string(),
  secret: z.string(),
  xroadPath: z.string(),
})

export const VehicleOperatorsClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'VehicleOperatorsClient',
  schema,
  load(env) {
    return {
      xroadBaseUrl: env.required('XROAD_BASE_PATH', 'http://localhost:8081'),
      xroadClientId: env.required(
        'XROAD_CLIENT_ID',
        'IS-DEV/GOV/10000/island-is-client',
      ),
      // TODOx laga tengingu við xroad. Þarf secret? ServiceName?
      secret: env.required('XROAD_VEHICLE_OPERATORS_SECRET', ''),
      xroadPath: env.required(
        'XROAD_VEHICLE_OPERATORS_PATH',
        'r1/IS-DEV/GOV/12345/Samgongustofa-Protected/<SERVICE_NAME>',
      ),
    }
  },
})
