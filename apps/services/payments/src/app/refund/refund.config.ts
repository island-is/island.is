import { z } from 'zod'

import { defineConfig } from '@island.is/nest/config'

const schema = z.object({
  paymentGateway: z.object({
    paymentsApiSecret: z.string(),
    paymentsApiHeaderKey: z.string(),
    paymentsApiHeaderValue: z.string(),
    paymentsGatewayApiUrl: z.string(),
    systemCalling: z.string(),
  }),
})

export type RefundModuleConfigType = z.infer<typeof schema>

export const RefundModuleConfig = defineConfig({
  name: 'RefundModuleConfig',
  schema,
  load: (env) => ({
    paymentGateway: {
      paymentsApiSecret: env.required('PAYMENTS_GATEWAY_API_SECRET'),
      paymentsApiHeaderKey: env.required('PAYMENTS_GATEWAY_API_HEADER_KEY'),
      paymentsApiHeaderValue: env.required('PAYMENTS_GATEWAY_API_HEADER_VALUE'),
      paymentsGatewayApiUrl: env.required('PAYMENTS_GATEWAY_API_URL'),
      systemCalling: env.required('PAYMENTS_GATEWAY_SYSTEM_CALLING'),
    },
  }),
})
