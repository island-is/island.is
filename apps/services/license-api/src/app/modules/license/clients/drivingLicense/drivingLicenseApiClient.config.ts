import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

export const schema = z.object({
  xroad: z.object({
    path: z.string(),
    secret: z.string(),
  }),
  apiKey: z.string(),
  apiUrl: z.string(),
  passTemplateId: z.string(),
})

export const DrivingLicenseApiClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'DrivingLicenseApiClientConfig',
  schema,
  load: (env) => ({
    xroad: {
      secret: env.required('XROAD_DRIVING_LICENSE_SECRET', ''),
      path: env.required(
        'XROAD_DRIVING_LICENSE_PATH',
        'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1',
      ),
    },
    apiKey: env.required('RLS_PKPASS_API_KEY', ''),
    apiUrl: env.required(
      'SMART_SOLUTIONS_API_URL',
      'https://smartpages-api-dev.smartsolutions.is/graphql',
    ),
    passTemplateId: env.required('DRIVING_LICENSE_PASS_TEMPLATE_ID', ''),
  }),
})
