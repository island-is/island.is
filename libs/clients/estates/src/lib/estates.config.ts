import { z } from 'zod'

import { DistrictCommissionersScope } from '@island.is/auth/scopes'
import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  xRoadServicePath: z.string(),
  scope: z.array(z.string()),
})

export const EstatesClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'EstatesClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_ESTATES_PATH',
      'IS-DEV/GOV/10016/Syslumenn-Protected/IslandMinarSidur',
    ),
    scope: [DistrictCommissionersScope.estatesScope],
  }),
})
