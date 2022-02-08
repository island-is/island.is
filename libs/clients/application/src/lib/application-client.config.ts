import { defineConfig } from '@island.is/nest/config'
import * as z from 'zod'

const schema = z.object({
  basePath: z.string(),
})

export const ApplicationClientConfig = defineConfig({
  name: 'ApplicationApi',
  schema,
  load(env) {
    return {
      basePath: env.required(
        'APPLICATION_SYSTEM_API_URL',
        'http://localhost:3333',
      ),
    }
  },
})
