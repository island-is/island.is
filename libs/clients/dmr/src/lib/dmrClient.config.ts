import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  fetch: z.object({
    timeout: z.number().int(),
    scope: z.array(z.string()),
  }),
})

export const DmrClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'DmrClientConfig',
  schema,
  load: () => ({
    fetch: {
      timeout: 10000,
      scope: [],
    },
  }),
})
