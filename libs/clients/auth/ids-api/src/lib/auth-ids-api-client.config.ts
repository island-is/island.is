import * as z from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  basePath: z.string(),
})

export const AuthIdsApiClientConfig = defineConfig({
  name: 'AuthIdsClient',
  schema,
  load(env) {
    return {
      basePath: env.required(
        'AUTH_IDS_API_URL',
        'https://innskra.dev01.devland.is',
      ),
    }
  },
})
