import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  apiKey: z.string(),
})

export const IntellectualPropertiesClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'IntellectualPropertiesClient',
  schema,
  load(env) {
    return {
      apiKey: env.required('INTELLECTUAL_PROPERTY_API_KEY', ''),
    }
  },
})
