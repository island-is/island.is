import * as z from 'zod'
import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  basePath: z.string(),
  rejectUnauthorized: z.boolean(),
})

export const OpenDataClientConfig = defineConfig({
  name: 'OpenDataClient',
  schema,
  load(env) {
    return {
      basePath:
        env.optional(
          'OPEN_DATA_API_URL',
          'https://ckan.island.is/api/3/action',
        ) || 'https://ckan.island.is/api/3/action',
      rejectUnauthorized:
        env.optional('OPEN_DATA_REJECT_UNAUTHORIZED') !== 'false',
    }
  },
})
