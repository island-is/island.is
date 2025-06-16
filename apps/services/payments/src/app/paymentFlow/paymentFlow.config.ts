import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  webOrigin: z.string(),
})

export type PaymentFlowModuleConfigType = z.infer<typeof schema>

export const PaymentFlowModuleConfig = defineConfig({
  name: 'PaymentFlowModuleConfig',
  schema,
  load: (env) => ({
    webOrigin: env.required('PAYMENTS_WEB_URL'),
  }),
})
