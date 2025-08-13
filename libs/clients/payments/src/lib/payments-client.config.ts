import * as z from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  basePath: z.string(),
})

export const PaymentsApiClientConfig = defineConfig({
  name: 'PaymentsClient',
  schema,
  load(env) {
    return {
      basePath: env.required('PAYMENTS_API_URL', 'http://localhost:5555'),
    }
  },
})
