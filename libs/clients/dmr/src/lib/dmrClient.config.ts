import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({})

export const DmrClientConfig = defineConfig<z.infer<typeof schema>>({
  name: 'DmrClientConfig',
  schema,
  load: () => ({}),
})
