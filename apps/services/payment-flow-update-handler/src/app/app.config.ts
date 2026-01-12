import { defineConfig } from '@island.is/nest/config'
import { z } from 'zod'

const schema = z.object({
  paymentsWebUrl: z.string(),
  paymentFlowUpdateHandlerApiUrl: z.string(),
  landspitali: z.object({
    webPaymentConfirmationSendToEmail: z.string(),
    webPaymentConfirmationSendFromEmail: z.string(),
    memorialCardPaymentConfirmationEmailSubject: z.string(),
    directGrantPaymentConfirmationEmailSubject: z.string(),
  }),
})

export const AppConfig = defineConfig({
  name: 'PaymentFlowUpdateHandlerConfig',
  schema,
  load: (env) => ({
    paymentsWebUrl: env.required('PAYMENTS_WEB_URL'),
    paymentFlowUpdateHandlerApiUrl: env.required(
      'PAYMENT_FLOW_UPDATE_HANDLER_API_URL',
    ),
    landspitali: {
      webPaymentConfirmationSendToEmail: env.required(
        'LANDSPITALI_WEB_PAYMENT_CONFIRMATION_SEND_TO_EMAIL',
      ),
      webPaymentConfirmationSendFromEmail: env.required(
        'LANDSPITALI_WEB_PAYMENT_CONFIRMATION_SEND_FROM_EMAIL',
      ),
      memorialCardPaymentConfirmationEmailSubject: env.required(
        'LANDSPITALI_WEB_MEMORIAL_CARD_PAYMENT_CONFIRMATION_EMAIL_SUBJECT',
      ),
      directGrantPaymentConfirmationEmailSubject: env.required(
        'LANDSPITALI_WEB_DIRECT_GRANT_PAYMENT_CONFIRMATION_EMAIL_SUBJECT',
      ),
    },
  }),
})
