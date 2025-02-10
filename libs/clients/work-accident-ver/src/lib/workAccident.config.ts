import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    scope: z.array(z.string()),
  }),
})

export const WorkAccidentClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'WorkAccidentClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_WORK_ACCIDENT_PATH',
      'IS-DEV/GOV/10013/Vinnueftirlitid-Protected/slysaskraning-token',
    ),
    fetch: {
      scope: ['@ver.is/umsyslaslysaskraning'],
    },
  }),
})
