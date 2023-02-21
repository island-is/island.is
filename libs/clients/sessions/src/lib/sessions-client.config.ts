import * as z from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  basePath: z.string(),
})

export const SessionsApiClientConfig = defineConfig({
  name: 'SessionsClient',
  schema,
  load(env) {
    return {
      basePath: env.required('SESSIONS_API_URL', 'http://localhost:3333'),
    }
  },
})
