import { z } from 'zod'
import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  goproUsername: z.string(),
  goproPassword: z.string(),
})

export const VerdictsClientConfig = defineConfig({
  name: 'VerdictsClient',
  schema,
  load(env) {
    return {
      goproUsername: env.required('VERDICTS_GOPRO_USERNAME'),
      goproPassword: env.required('VERDICTS_GOPRO_PASSWORD'),
    }
  },
})
