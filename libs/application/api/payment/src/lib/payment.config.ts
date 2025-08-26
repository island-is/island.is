import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const PaymentModule = z.object({
  callbackBaseUrl: z.string(),
  callbackAdditionUrl: z.string(),
  arkBaseUrl: z.string(),
  clientLocationOrigin: z.string(),
  authIssuer: z.string(),
  paymentApiCallbackUrl: z.string(),
})

export const PaymentModuleConfig = defineConfig({
  name: 'PaymentModule',
  schema: PaymentModule,
  load: (env) => ({
    arkBaseUrl: env.required('ARK_BASE_URL', 'https://uat.arkid.is'),
    callbackAdditionUrl: env.required(
      'XROAD_PAYMENT_ADDITION_CALLBACK_URL',
      '/',
    ),
    callbackBaseUrl: env.required(
      'XROAD_PAYMENT_BASE_CALLBACK_URL',
      'https://localhost:3333/applications/',
    ),
    clientLocationOrigin: env.required(
      'CLIENT_LOCATION_ORIGIN',
      `http://localhost:${process.env.WEB_FRONTEND_PORT ?? '4242'}/umsoknir`,
    ),
    authIssuer: env.required(
      'IDENTITY_SERVER_ISSUER_URL',
      'https://identity-server.dev01.devland.is',
    ),
    paymentApiCallbackUrl: env.required(
      'PAYMENT_API_CALLBACK_URL',
      'http://localhost:3333/applications/',
    ),
  }),
})
