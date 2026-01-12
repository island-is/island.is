import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    scope: z.array(z.string()),
  }),
})

export const PracticalExamsClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'PracticalExamsClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_PRACTICAL_EXAMS_PATH',
      'IS-DEV/GOV/10013/Vinnueftirlitid-Protected/verkleg-prof-token',
    ),
    fetch: {
      scope: ['@ver.is/rettindaskra'],
    },
  }),
})
