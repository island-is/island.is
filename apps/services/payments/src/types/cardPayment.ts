import { z } from 'zod'

export interface CachePaymentFlowStatus {
  isVerified?: boolean
  correlationId?: string
}

export interface SavedVerificationPendingData {
  paymentFlowId: string
}

export interface SavedVerificationCompleteData {
  cavv: string
  mdStatus: string
  xid: string
  dsTransId: string
}

export interface MdSerialized {
  c: string // payment transaction correlation id
  iat: number
}

export interface MdNormalised {
  correlationId: string
  issuedAt: number
}

export interface PaymentTrackingData {
  merchantReferenceData: string
  correlationId: string
  paymentDate: Date
}

export const CardInformationSchema = z.object({
  cardScheme: z.string(),
  issuingCountry: z.string(),
  cardUsage: z.string(),
  cardCategory: z.string(),
  outOfScaScope: z.boolean(),
  cardProductCategory: z.string().optional().nullable(),
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

/** Card payment (charge) success: full transaction data */
export const CardPaymentSuccessSchema = PaymentGatewayApiResponseSchema.extend({
  isSuccess: z.literal(true),
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
})

/** Card payment (charge) error: transaction fields omitted or partial */
export const CardPaymentErrorSchema = PaymentGatewayApiResponseSchema.extend({
  isSuccess: z.literal(false),
  acquirerReferenceNumber: z.string().optional(),
  transactionID: z.string().optional(),
  authorizationCode: z.string().optional(),
  transactionLifecycleId: z.string().optional(),
  maskedCardNumber: z.string().optional(),
  cardInformation: CardInformationSchema.optional(),
  transactionType: z.string().optional(),
  isCardPresent: z.boolean().optional(),
  currency: z.string().optional(),
  authenticationMethod: z.string().optional(),
  authorizedAmount: z.number().optional(),
  marketInformation: MarketInformationSchema.optional(),
  authorizationIdentifier: z.string().optional(),
})

export const CardPaymentResponseSchema = z.discriminatedUnion('isSuccess', [
  CardPaymentSuccessSchema,
  CardPaymentErrorSchema,
])

/** Refund success: full transaction data */
export const RefundSuccessSchema = PaymentGatewayApiResponseSchema.extend({
  isSuccess: z.literal(true),
  acquirerReferenceNumber: z.string(),
  transactionID: z.string(),
  transactionLifecycleId: z.string(),
  maskedCardNumber: z.string(),
  cardInformation: CardInformationSchema,
  authorizationIdentifier: z.string(),
})

/** Refund error: transaction fields omitted or partial */
export const RefundErrorSchema = PaymentGatewayApiResponseSchema.extend({
  isSuccess: z.literal(false),
  acquirerReferenceNumber: z.string().optional(),
  transactionID: z.string().optional(),
  transactionLifecycleId: z.string().optional(),
  maskedCardNumber: z.string().optional(),
  cardInformation: CardInformationSchema.optional(),
  authorizationIdentifier: z.string().optional(),
})

export const RefundResponseSchema = z.discriminatedUnion('isSuccess', [
  RefundSuccessSchema,
  RefundErrorSchema,
])

export const FieldSchema = z.object({
  name: z.string(),
  value: z.string(),
})

const CardVerificationBaseSchema = PaymentGatewayApiResponseSchema.extend({
  cardInformation: CardInformationSchema,
  threeDSMessageVersion: z.string().optional(),
})

/** Card verification success: includes 3DS redirect data */
export const CardVerificationSuccessSchema = CardVerificationBaseSchema.extend({
  isSuccess: z.literal(true),
  cardVerificationRawResponse: z.string(),
  postUrl: z.string(),
  verificationFields: z.array(FieldSchema),
  additionalFields: z.array(FieldSchema),
  scriptPath: z.string().optional(),
})

/** Card verification error: 3DS fields omitted (e.g. C6-M rejected by MPI) */
export const CardVerificationErrorSchema = CardVerificationBaseSchema.extend({
  isSuccess: z.literal(false),
  cardVerificationRawResponse: z.string().optional(),
  postUrl: z.string().optional(),
  verificationFields: z.array(FieldSchema).optional(),
  additionalFields: z.array(FieldSchema).optional(),
  scriptPath: z.string().optional(),
})

export const CardVerificationResponseSchema = z.discriminatedUnion(
  'isSuccess',
  [CardVerificationSuccessSchema, CardVerificationErrorSchema],
)

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

/** Apple Pay session success */
export const ApplePaySessionSuccessSchema =
  PaymentGatewayApiResponseSchema.extend({
    isSuccess: z.literal(true),
    session: z.string(),
  })

/** Apple Pay session error: session omitted */
export const ApplePaySessionErrorSchema =
  PaymentGatewayApiResponseSchema.extend({
    isSuccess: z.literal(false),
    session: z.string().optional(),
  })

export const ApplePaySessionResponseSchema = z.discriminatedUnion('isSuccess', [
  ApplePaySessionSuccessSchema,
  ApplePaySessionErrorSchema,
])

const ApplePayPaymentDataSchema = z.object({
  Version: z.string(),
  Data: z.string(),
  Signature: z.string(),
  Header: z.object({
    EphemeralPublicKey: z.string(),
    PublicKeyHash: z.string(),
    TransactionId: z.string(),
  }),
})

const ApplePayPaymentMethodSchema = z.object({
  DisplayName: z.string(),
  Network: z.string(),
})

const ApplePayPaymentTokenSchema = z.object({
  PaymentData: ApplePayPaymentDataSchema,
  PaymentMethod: ApplePayPaymentMethodSchema,
  TransactionIdentifier: z.string(),
})

export const ApplePayPaymentInputSchema = z.object({
  Operation: z.string(),
  WalletPaymentType: z.literal('ApplePay'),
  ApplePayWalletPayment: z.object({
    PaymentToken: ApplePayPaymentTokenSchema,
  }),
  paymentAdditionalData: z.object({
    merchantReferenceData: z.string(),
  }),
  systemCalling: z.string(),
  correlationId: z.string(),
})

export type ApplePayPaymentInput = z.infer<typeof ApplePayPaymentInputSchema>
export type CardPaymentInput = z.infer<typeof CardPaymentInputSchema>
export type CardVerificationResponse = z.infer<
  typeof CardVerificationResponseSchema
>
export type CardVerificationSuccessResponse = z.infer<
  typeof CardVerificationSuccessSchema
>
export type CardPaymentResponse = z.infer<typeof CardPaymentResponseSchema>
export type CardPaymentSuccessResponse = z.infer<
  typeof CardPaymentSuccessSchema
>
export type RefundResponse = z.infer<typeof RefundResponseSchema>
export type RefundSuccessResponse = z.infer<typeof RefundSuccessSchema>
export type ApplePaySessionSuccessResponse = z.infer<
  typeof ApplePaySessionSuccessSchema
>
