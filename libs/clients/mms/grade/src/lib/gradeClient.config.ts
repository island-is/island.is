import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const GradeClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'GradeClientConfig',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_MMS_GRADE_SERVICE_ID',
        'IS-DEV/GOV/10066/MMS-Protected/grade-api-v1',
      ),
    }
  },
})
