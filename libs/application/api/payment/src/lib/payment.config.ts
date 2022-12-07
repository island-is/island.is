import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const PaymentModule = z.object({
  xRoadBaseUrl: z.string(),
  xRoadProviderId: z.string(),
  xRoadClientId: z.string(),
  username: z.string(),
  password: z.string(),
  callbackBaseUrl: z.string(),
  callbackAdditionUrl: z.string(),
  arkBaseUrl: z.string(),
})

export const PaymentModuleConfig = defineConfig({
  name: 'PaymentModule',
  schema: PaymentModule,
  load: (env) => ({
    arkBaseUrl: env.required('ARK_BASE_URL'),
    xRoadBaseUrl: env.required('XROAD_BASE_PATH', 'http://localhost:8081'),
    xRoadClientId: env.required(
      'XROAD_CLIENT_ID',
      'IS-DEV/GOV/10000/island-is-client',
    ),
    xRoadProviderId: env.required(
      'XROAD_PAYMENT_PROVIDER_ID',
      'IS-DEV/GOV/10021/FJS-Public',
    ),
    callbackAdditionUrl: env.required(
      'XROAD_PAYMENT_ADDITION_CALLBACK_URL',
      '/',
    ),
    callbackBaseUrl: env.required(
      'XROAD_PAYMENT_BASE_CALLBACK_URL',
      'https://localhost:3333/applications/',
    ),
    username: env.required('XROAD_PAYMENT_USER'),
    password: env.required('XROAD_PAYMENT_PASSWORD'),
  }),
})
