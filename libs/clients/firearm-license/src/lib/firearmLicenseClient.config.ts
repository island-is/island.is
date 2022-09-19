import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
})

export const FirearmLicenseClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'FirearmLicenseClient',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_FIREARM_LICENSE_PATH',
      'IS-DEV/GOV/10005/Logreglan-Protected/island-api-v1',
    ),
  }),
})
