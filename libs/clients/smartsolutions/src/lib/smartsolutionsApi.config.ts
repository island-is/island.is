import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  pkPassApiKey: z.string(),
})

export const SmartSolutionsClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'SmartSolutionsClient',
  schema,
  load: (env) => ({
    pkPassApiKey: env.required('VE_PKPASS_KEY'),
  }),
})
