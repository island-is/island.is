import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const PCardClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'PCardClient',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_DISTRICT_COMMISSIONERS_PATH',
      'IS-DEV/GOV/10016/Syslumenn-Protected/IslandMinarSidur',
    ),
  }),
})
