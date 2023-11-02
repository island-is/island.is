import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  xRoadServicePath: z.string(),
  xRoadFirearmOpenApiKey: z.string(),
})

export const OpenFirearmLicenseClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'OpenFirearmLicenseClientConfig',
  schema,
  load: (env) => ({
    xRoadServicePath: env.required(
      'XROAD_FIREARM_LICENSE_PATH',
      'IS-DEV/GOV/10005/Logreglan-Protected/island-api-v1',
    ),
    xRoadFirearmOpenApiKey: env.required('RLS_OPEN_LOOKUP_API_KEY', ''),
  }),
})
