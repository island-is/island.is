import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const PrimarySchoolClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'PrimarySchoolClientConfig',
  schema,
  load(env) {
    return {
      xRoadServicePath: env.required(
        'XROAD_MMS_PRIMARY_SCHOOL_SERVICE_ID',
        'IS-DEV/GOV/10066/MMS-Protected/data-gateway-backend-internal',
      ),
    }
  },
})
