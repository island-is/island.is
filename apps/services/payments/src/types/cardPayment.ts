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

const CardInformationSchema = z.object({
  cardScheme: z.string(),
  issuingCountry: z.string().optional().nullable(),
  cardUsage: z.string(),
  cardCategory: z.string().optional().nullable(),
  outOfScaScope: z.boolean().optional().nullable(),
  cardProductCategory: z.string().optional().nullable(),
})

const MarketInformationSchema = z.object({
  merchantCountry: z.string(),
  marketName: z.string(),
  acquirerRegion: z.string(),
})

const PaymentGatewayApiResponseSchema = z.object({
  isSuccess: z.boolean(),
  responseCode: z.string(),
  responseDescription: z.string().optional(),
  responseTime: z.string(), // HH:mm:ss
  correlationID: z.string(),
})

const PaymentGatewaySuccessSchema = PaymentGatewayApiResponseSchema.extend({
  isSuccess: z.literal(true),
})

const PaymentGatewayErrorSchema = PaymentGatewayApiResponseSchema.extend({
  isSuccess: z.literal(false),
})

/** Card payment (charge) success: full transaction data */
export const CardPaymentSuccessSchema = PaymentGatewaySuccessSchema.extend({
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
export const CardPaymentErrorSchema = PaymentGatewayErrorSchema

/** Refund success: full transaction data */
export const RefundSuccessSchema = PaymentGatewaySuccessSchema.extend({
  isSuccess: z.literal(true),
  acquirerReferenceNumber: z.string(),
  transactionID: z.string(),
  transactionLifecycleId: z.string(),
  maskedCardNumber: z.string(),
  cardInformation: CardInformationSchema,
  authorizationIdentifier: z.string(),
})

/** Refund error: transaction fields omitted or partial */
export const RefundErrorSchema = PaymentGatewayErrorSchema

const FieldSchema = z.object({
  name: z.string(),
  value: z.string(),
})

/** Card verification success: includes 3DS redirect data */
export const CardVerificationSuccessSchema = PaymentGatewaySuccessSchema.extend(
  {
    cardVerificationRawResponse: z.string(),
    postUrl: z.string(),
    verificationFields: z.array(FieldSchema),
    additionalFields: z.array(FieldSchema),
    scriptPath: z.string().optional(),
    cardInformation: CardInformationSchema.optional(),
    threeDSMessageVersion: z.string().optional(),
  },
)

/** Card verification error: 3DS fields omitted (e.g. C6-M rejected by MPI) */
export const CardVerificationErrorSchema = PaymentGatewayErrorSchema

/** Apple Pay session success */
export const ApplePaySessionSuccessSchema = PaymentGatewaySuccessSchema.extend({
  session: z.string(),
})

/** Apple Pay session error */
export const ApplePaySessionErrorSchema = PaymentGatewayErrorSchema

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
export type CardVerificationSuccessResponse = z.infer<
  typeof CardVerificationSuccessSchema
>
export type CardPaymentResponse =
  | z.infer<typeof CardPaymentSuccessSchema>
  | z.infer<typeof CardPaymentErrorSchema>
export type CardPaymentSuccessResponse = z.infer<
  typeof CardPaymentSuccessSchema
>
export type RefundResponse =
  | z.infer<typeof RefundSuccessSchema>
  | z.infer<typeof RefundErrorSchema>
export type RefundSuccessResponse = z.infer<typeof RefundSuccessSchema>
