import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  fetch: z.object({
    timeout: z.number().int(),
  }),
})

export const InnaClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'InnaClientConfig',
  schema,
  load: (env) => ({
    fetch: {
      timeout: 30000,
    },
  }),
})
