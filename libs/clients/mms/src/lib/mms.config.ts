import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xroadServicePathLicense: z.string(),
  xroadServicePathGrade: z.string(),
})

export const MMSClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'MMSClientConfig',
  schema,
  load: (env) => ({
    xroadServicePathLicense: env.required(
      'XROAD_MMS_LICENSE_SERVICE_ID',
      'IS-DEV/EDU/10020/MMS-Protected/license-api-v1',
    ),
    xroadServicePathGrade: env.required(
      'XROAD_MMS_GRADE_SERVICE_ID',
      'IS-DEV/EDU/10020/MMS-Protected/grade-api-v1',
    ),
  }),
})
