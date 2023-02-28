import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  fetch: z.object({
    timeout: z.number().int(),
  }),
})

export const IcelandicHealthInsuranceClientConfig = defineConfig<
  z.infer<typeof schema>
>({
  name: 'IcelandicHealthInsurance',
  schema,
  load(env) {
    return {
      fetch: {
        timeout: 30000,
      },
    }
  },
})
