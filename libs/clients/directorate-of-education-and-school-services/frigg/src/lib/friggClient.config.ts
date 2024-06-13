import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  scope: z.array(z.string()),
  audience: z.string(),
})

export const FriggClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'FriggApi',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_MMS_FRIGG_PATH',
      'IS-DEV/GOV/10066/MMS-Protected/frigg-api',
    ),
    scope: [],
    audience: '@mms.is/frigg',
  }),
})
