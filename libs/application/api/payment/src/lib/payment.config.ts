import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const PaymentModule = z.object({
  callbackBaseUrl: z.string(),
  callbackAdditionUrl: z.string(),
  arkBaseUrl: z.string(),
})

export const PaymentModuleConfig = defineConfig({
  name: 'PaymentModule',
  schema: PaymentModule,
  load: (env) => ({
    arkBaseUrl: env.required('ARK_BASE_URL'),
    callbackAdditionUrl: env.required(
      'XROAD_PAYMENT_ADDITION_CALLBACK_URL',
      '/',
    ),
    callbackBaseUrl: env.required(
      'XROAD_PAYMENT_BASE_CALLBACK_URL',
      'https://localhost:3333/applications/',
    ),
  }),
})
