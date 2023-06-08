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
        scope: ['@tr.is/oryrki:read'],
      },
      apiKey: env.required(
        'IP_API_KEY',
        '7F04EA52-C8BC-47B1-BA18-B39335FEA822',
      ),
    }
  },
})
