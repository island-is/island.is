import { z } from 'zod'

export interface PaymentTrackingData {
  merchantReferenceData: string
  correlationId: string
  paymentDate?: Date
}

export const CardInformationSchema = z.object({
  cardScheme: z.string(),
  issuingCountry: z.string(),
  cardUsage: z.string(),
  cardCategory: z.string(),
  outOfScaScope: z.boolean(),
  cardProductCategory: z.string().optional(),
})

export const MarketInformationSchema = z.object({
  merchantCountry: z.string(),
  marketName: z.string(),
  acquirerRegion: z.string(),
})

export const PaymentGatewayApiResponseSchema = z.object({
  isSuccess: z.boolean(),
  responseCode: z.string(),
  responseDescription: z.string().optional(),
  responseTime: z.string(), // HH:mm:ss
  correlationID: z.string(),
})

export const CardPaymentResponseSchema = PaymentGatewayApiResponseSchema.extend(
  {
    acquirerReferenceNumber: z.string(),
    transactionID: z.string(),
    authorizationCode: z.string(),
    transactionLifecycleId: z.string(),
    maskedCardNumber: z.string(),

    cardInformation: CardInformationSchema,

    transactionType: z.string().optional(),
    isCardPresent: z.boolean().optional(),
    currency: z.string().optional(),
    authenticationMethod: z.string().optional(),
    authorizedAmount: z.number().optional(),

    marketInformation: MarketInformationSchema.optional(),

    authorizationIdentifier: z.string(),
  },
)

export const RefundResponseSchema = PaymentGatewayApiResponseSchema.extend({
  acquirerReferenceNumber: z.string(),
  transactionID: z.string(),
  transactionLifecycleId: z.string(),
  maskedCardNumber: z.string(),
  cardInformation: CardInformationSchema,
  authorizationIdentifier: z.string(),
})

export const FieldSchema = z.object({
  name: z.string(),
  value: z.string(),
})

export const CardVerificationResponseSchema =
  PaymentGatewayApiResponseSchema.extend({
    cardVerificationRawResponse: z.string(),
    postUrl: z.string().url(),
    verificationFields: z.array(FieldSchema),
    additionalFields: z.array(FieldSchema),
    cardInformation: CardInformationSchema,
  })

export const CardVerificationDataSchema = z.object({
  cavv: z.string(),
  mdStatus: z.string(),
  xid: z.string(),
  dsTransId: z.string(),
})

export const CardPaymentInputSchema = z.object({
  operation: z.string(),
  transactionType: z.string(),
  cardNumber: z.string(),
  expirationMonth: z.number().int().min(1).max(12),
  expirationYear: z.number().int(),
  cvc: z.string(),
  currency: z.string(),
  amount: z.number(),
  systemCalling: z.string(),
  cardVerificationData: CardVerificationDataSchema.optional(),
})

export type CardPaymentInput = z.infer<typeof CardPaymentInputSchema>
export type CardVerificationResponse = z.infer<
  typeof CardVerificationResponseSchema
>
export type RefundResponse = z.infer<typeof RefundResponseSchema>
export type CardPaymentResponse = z.infer<typeof CardPaymentResponseSchema>
