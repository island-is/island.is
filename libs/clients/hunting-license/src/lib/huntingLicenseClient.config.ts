import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  scope: z.array(z.string()),
})

export const HuntingLicenseClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'HuntingLicenseClient',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_HUNTING_LICENSE_PATH',
      'IS-DEV/GOV/10009/Umhverfisstofnun-Protected/api',
    ),
    scope: [''],
  }),
})
