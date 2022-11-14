import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'
import { RLSScope } from '@island.is/auth/scopes'

const schema = z.object({
  xRoadServicePath: z.string(),
  fetch: z.object({
    scope: z.array(z.string()),
  }),
})

export const FirearmLicenseClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'FirearmLicenseClient',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_FIREARM_LICENSE_PATH',
      'IS-DEV/GOV/10005/Logreglan-Protected/island-api-v1',
    ),
    fetch: {
      scope: [RLSScope.firearmPermit],
    },
  }),
})
