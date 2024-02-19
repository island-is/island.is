import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  basePath: z.string(),
  fetch: z.object({
    timeout: z.number().int(),
    scope: z.array(z.string()),
  }),
})

export const DmrClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'DmrClientConfig',
  schema,
  load: (env) => ({
    basePath: 'https://api.official-journal.dev.dmr-dev.cloud',
    fetch: {
      timeout: 10000,
      scope: [],
    },
  }),
})
