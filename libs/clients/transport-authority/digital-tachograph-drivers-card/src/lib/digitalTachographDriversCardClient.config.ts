import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'
import { VehiclesScope } from '@island.is/auth/scopes'

const schema = z.object({
  xroadBaseUrl: z.string(),
  xroadClientId: z.string(),
  xroadPath: z.string(),
  scope: z.array(z.string()),
})

export const DigitalTachographDriversCardClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'DigitalTachographDriversCardClient',
  schema,
  load(env) {
    return {
      xroadBaseUrl: env.required('XROAD_BASE_PATH', 'http://localhost:8081'),
      xroadClientId: env.required(
        'XROAD_CLIENT_ID',
        'IS-DEV/GOV/10000/island-is-client',
      ),
      xroadPath: env.required(
        'XROAD_DIGITAL_TACHOGRAPH_DRIVERS_CARD_PATH',
        'IS-DEV/GOV/10017/Samgongustofa-Protected/TODOX',
      ),
      scope: [VehiclesScope.vehicle],
    }
  },
})
