import { z } from 'zod'
import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  basePath: z.string(),
})

export const MideindClientConfig = defineConfig({
  name: 'MideindApi',
  schema,
  load(env) {
    return {
      basePath: env.required(
        'MIDEIND_API_BASE_PATH',
        'https://api.greynir.is',
      ),
    }
  }
})
