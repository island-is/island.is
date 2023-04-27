import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  fetch: z.object({
    timeout: z.number().int(),
    scope: z.array(z.string()),
  }),
})

export const RightsPortalClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'RightsPortalConfig',
  schema,
  load(env) {
    return {
      fetch: {
        timeout: 30000,
        scope: ['@sjukra.is/minarsidur'],
      },
    }
  },
})
