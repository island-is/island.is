import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  basePath: z.string(),
})

export const AuthDelegationApiClientConfig = defineConfig({
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
