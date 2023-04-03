import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  fetch: z.object({
    timeout: z.number().int(),
  }),
})

export const RightsPortalClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'RightsPortalConfig',
  schema,
  load(env) {
    return {
      fetch: {
        timeout: 30000,
      },
    }
  },
})
