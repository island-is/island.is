import * as z from 'zod'
import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  basePath: z.string(),
})

export const OpenDataClientConfig = defineConfig({
  name: 'OpenDataClient',
  schema,
  load(env) {
    return {
      basePath:
        env.optional(
          'OPEN_DATA_API_URL',
          'https://localhost:8443/api/3/action',
        ) || 'https://localhost:8443/api/3/action',
    }
  },
})
