import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const PaymentClientModule = z.object({
  xRoadBaseUrl: z.string(),
  xRoadProviderId: z.string(),
  xRoadClientId: z.string(),
  username: z.string(),
  password: z.string(),
})

export const PaymentClientModuleConfig = defineConfig({
  name: 'PaymentClientModule',
  schema: PaymentClientModule,
  load: (env) => ({
    xRoadBaseUrl: env.required('XROAD_BASE_PATH', 'http://localhost:8081'),
    xRoadClientId: env.required(
      'XROAD_CLIENT_ID',
      'IS-DEV/GOV/10000/island-is-client',
    ),
    xRoadProviderId: env.required(
      'XROAD_PAYMENT_PROVIDER_ID',
      'IS-DEV/GOV/10021/FJS-Public',
    ),

    username: env.required('XROAD_PAYMENT_USER'),
    password: env.required('XROAD_PAYMENT_PASSWORD'),
  }),
})
