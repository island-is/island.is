import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  paymentFlowEventCallbackUrl: z.string(),
  paymentConfirmationSendToEmail: z.string(),
  paymentConfirmationSendFromEmail: z.string(),
  memorialCardPaymentConfirmationSubject: z.string(),
  directGrantPaymentConfirmationSubject: z.string(),
  paymentNationalIdFallback: z.string(),
  webValidationSecret: z.string(),
})

export const LandspitaliApiModuleConfig = defineConfig({
  name: 'LandspitaliApiModuleConfig',
  schema,
  load: (env) => ({
    paymentFlowEventCallbackUrl: env.required(
      'LANDSPITALI_PAYMENT_FLOW_EVENT_CALLBACK_URL',
    ),
    paymentConfirmationSendToEmail: env.required(
      'LANDSPITALI_PAYMENT_CONFIRMATION_SEND_TO_EMAIL',
    ),
    paymentConfirmationSendFromEmail: env.required('SEND_FROM_EMAIL'),
    memorialCardPaymentConfirmationSubject: env.required(
      'LANDSPITALI_MEMORIAL_CARD_PAYMENT_CONFIRMATION_EMAIL_SUBJECT',
    ),
    directGrantPaymentConfirmationSubject: env.required(
      'LANDSPITALI_DIRECT_GRANT_PAYMENT_CONFIRMATION_EMAIL_SUBJECT',
    ),
    paymentNationalIdFallback: env.required(
      'LANDSPITALI_PAYMENT_NATIONAL_ID_FALLBACK',
    ),
    webValidationSecret: env.required('WEB_PAYMENT_CONFIRMATION_SECRET'),
  }),
})
