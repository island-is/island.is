import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  pkPassApiKey: z.string(),
  pkPassApiUrl: z.string(),
})

export const SmartSolutionsClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'SmartSolutionsClient',
  schema,
  load: (env) => ({
    pkPassApiKey: env.required('VE_PKPASS_API_KEY'),
    pkPassApiUrl: env.required('SMART_SOLUTIONS_API_URL'),
  }),
})
