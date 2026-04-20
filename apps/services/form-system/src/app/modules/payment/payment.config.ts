import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const PaymentModule = z.object({
  clientLocationOrigin: z.string(),
  authIssuer: z.string(),
  paymentApiCallbackUrl: z.string(),
})

export const PaymentModuleConfig = defineConfig({
  name: 'PaymentModule',
  schema: PaymentModule,
  load: (env) => ({
    clientLocationOrigin: env.required(
      'CLIENT_LOCATION_ORIGIN',
      `http://localhost:${process.env.WEB_FRONTEND_PORT ?? '4242'}/form`,
    ),
    authIssuer: env.required(
      'IDENTITY_SERVER_ISSUER_URL',
      'https://identity-server.dev01.devland.is',
    ),
    paymentApiCallbackUrl: env.required(
      'PAYMENT_API_CALLBACK_URL',
      'http://localhost:3333/form/',
    ),
  }),
})
