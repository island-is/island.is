import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  fetch: z.object({
    timeout: z.number().int(),
  }),
})

export const RigthsPortalClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'RightsPortal',
  schema,
  load(env) {
    return {
      fetch: {
        timeout: 30000,
      },
    }
  },
})
