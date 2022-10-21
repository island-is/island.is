import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadBaseUrl: z.string(),
  xroadClientId: z.string(),
  secret: z.string(),
  xroadPath: z.string(),
})

export const VehicleCoOwnerClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'VehicleCoOwnerClient',
  schema,
  load(env) {
    return {
      xroadBaseUrl: env.required('XROAD_BASE_PATH', 'http://localhost:8081'),
      xroadClientId: env.required(
        'XROAD_CLIENT_ID',
        'IS-DEV/GOV/10000/island-is-client',
      ),
      secret: env.required('XROAD_VEHICLE_CO_OWNER_SECRET', ''), //TODOx munum við nota secret?
      xroadPath: env.required(
        'XROAD_VEHICLE_CO_OWNER_PATH',
        'r1/IS-DEV/GOV/12345/Samgongustofa-Protected/<TODOX_SERVICE_NAME>',
      ),
    }
  },
})
