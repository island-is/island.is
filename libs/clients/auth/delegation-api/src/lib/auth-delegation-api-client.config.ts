import * as z from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  basePath: z.string(),
  machineClientScope: z.array(z.string()),
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
      machineClientScope: env.optionalJSON<string[]>(
        'AUTH_DELEGATION_MACHINE_CLIENT_SCOPE',
      ) ?? ['@island.is/auth/delegations/index:system'],
    }
  },
})
