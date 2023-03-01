import * as z from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  basePath: z.string(),
})

export const AuthAdminApiClientConfig = defineConfig({
  name: 'AuthDelegationClient',
  schema,
  load(env) {
    return {
      basePath: env.required(
        'AUTH_DELEGATION_API_URL',
        'http://localhost:5333',
      ),
    }
  },
})
