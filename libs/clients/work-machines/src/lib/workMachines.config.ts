import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  fetch: z.object({
    timeout: z.number().int(),
  }),
})

export const WorkMachinesClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'WorkMachinesClientConfig',
  schema,
  load: () => ({
    fetch: {
      timeout: 10000,
    },
  }),
})
