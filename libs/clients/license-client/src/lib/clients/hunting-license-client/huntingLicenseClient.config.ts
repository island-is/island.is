import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

export const schema = z.object({
  apiKey: z.string(),
  apiUrl: z.string(),
  passTemplateId: z.string(),
})

export const HuntingDigitalLicenseClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: `HuntingDigitalLicenseClientConfig`,
  schema,
  load: (env) => ({
    apiKey: env.required(`UST_PKPASS_API_KEY`, ''),
    apiUrl: env.required(
      'SMART_SOLUTIONS_API_URL',
      'https://smartpages-api-dev.smartsolutions.is/graphql',
    ),
    passTemplateId: env.required(
      `HUNTING_LICENSE_PASS_TEMPLATE_ID`,
      '1da72d52-a93a-4d0f-8463-1933a2bd210b',
    ),
  }),
})
