import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  basePath: z.string(),
})

export const AuthPublicApiClientConfig = defineConfig({
  name: 'AuthPubliClient',
  schema,
  load(env) {
    return {
      basePath: env.required('AUTH_PUBLIC_API_URL', 'http://localhost:3370'),
    }
  },
})
