import * as z from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  basePaths: z.object({
    development: z.string().optional(),
    staging: z.string().optional(),
    production: z.string().optional(),
  }),
})

export const AuthAdminApiClientConfig = defineConfig({
  name: 'AuthAdminApiClientConfig',
  schema,
  load(env) {
    return {
      basePaths: env.requiredJSON('AUTH_ADMIN_API_PATHS', {
        development: 'http://localhost:6333/backend',
      }),
    }
  },
})
