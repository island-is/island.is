import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  fetch: z.object({
    scope: z.array(z.string()),
  }),
  apiKey: z.string(),
})

export const IntellectualPropertyClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'IntellectualPropertyClient',
  schema,
  load(env) {
    return {
      fetch: {
        scope: [''],
      },
      apiKey: env.required('INTELLECTUAL_PROPERTY_API_KEY', ''),
    }
  },
})
