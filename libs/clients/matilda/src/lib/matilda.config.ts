import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  baseUrl: z.string(),
  distributorId: z.string(),
  apiKey: z.string(),
})

export const MatildaClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'MatildaClientConfig',
  schema,
  load: (env) => ({
    baseUrl: env.required(
      'MATILDA_BASE_URL',
      'https://matildaplatform.com/api/menu-publication',
    ),
    distributorId: env.required('MATILDA_DISTRIBUTOR_ID'),
    apiKey: env.required('MATILDA_API_KEY'),
  }),
})
