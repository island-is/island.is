import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

export const schema = z.object({
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
    apiKey: env.required('RLS_PKPASS_API_KEY', ''),
    apiUrl: env.required(
      'SMART_SOLUTIONS_API_URL',
      'https://smartpages-api-dev.smartsolutions.is/graphql',
    ),
    passTemplateId: env.required('DRIVING_LICENSE_PASS_TEMPLATE_ID', ''),
  }),
})
