import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  scopes: z.array(z.string()),
})

export const LshDevConfig = defineConfig<z.infer<typeof schema>>({
  name: 'LshDevClient',
  schema,
  load: () => ({
    scopes: ['@landspitali.is/app:write', '@landspitali.is/sjukraskrar:read'],
  }),
})
