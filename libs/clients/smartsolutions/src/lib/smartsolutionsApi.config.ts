import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  pkPassApiKeys: z.object({
    veApiKey: z.string(),
    rlsApiKey: z.string(),
  }),
  pkPassApiUrl: z.string(),
  timeout: z.number(),
})

export const SmartSolutionsClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'SmartSolutionsClient',
  schema,
  load: (env) => ({
    pkPassApiKeys: {
      veApiKey: env.required('VE_PKPASS_API_KEY', ''),
      rlsApiKey: env.required('RLS_PKPASS_API_KEY', ''),
    },
    pkPassApiUrl: env.required(
      'SMART_SOLUTIONS_API_URL',
      'https://smartpages-api-dev.smartsolutions.is/graphql',
    ),
    timeout: 50000,
  }),
})
