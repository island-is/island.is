import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  paymentFlowEventCallbackUrl: z.string(),
})

export const LandspitaliApiModuleConfig = defineConfig({
  name: 'LandspitaliApiModuleConfig',
  schema,
  load: (env) => ({
    paymentFlowEventCallbackUrl: env.required(
      'LANDSPITALI_PAYMENT_FLOW_EVENT_CALLBACK_URL',
    ),
  }),
})
