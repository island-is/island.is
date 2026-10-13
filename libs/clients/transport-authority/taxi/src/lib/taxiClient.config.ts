import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xroadPath: z.string(),
})

export const TaxiClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'TaxiClient',
  schema,
  load(env) {
    return {
      xroadPath: env.required(
        'XROAD_TAXI_PATH',
        'IS-DEV/GOV/10017/Samgongustofa-Protected/TAXI-ISLANDIS',
      ),
    }
  },
})
