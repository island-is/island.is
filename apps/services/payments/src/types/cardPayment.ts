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

/*
 * The gateway's responses only require the fields the service can not work
 * without: isSuccess, what a charge is stored with and FJS is sent, what the
 * payer is sent to 3-D Secure with, the Apple Pay session and the decrypted
 * Google Pay card. Every other field is optional, missing or null alike: the
 * gateway's API marks almost every field nullable, and on 19 Nov 2026 it left
 * out fields the service required, which turned approved charges and refunds
 * into failures while the money had moved. An approved charge that lacks a
 * required field is refunded, see GatewayApprovedUnreadableError.
 */

/** A field the gateway may leave out or answer with null, read as missing */
const optional = <T extends z.ZodTypeAny>(schema: T) =>
  schema.nullish().transform((value) => value ?? undefined)

const CardInformationSchema = z.object({
  // Stored with the payment and sent to FJS as the card type and debit or credit
  cardScheme: z.string(),
  cardUsage: z.string(),
  issuingCountry: optional(z.string()),
  cardCategory: optional(z.string()),
  outOfScaScope: optional(z.boolean()),
  cardProductCategory: optional(z.string()),
})

/** The card information of a refund or a 3-D Secure verification, which nothing reads */
const UnreadCardInformationSchema = CardInformationSchema.extend({
  cardScheme: optional(z.string()),
  cardUsage: optional(z.string()),
})

const MarketInformationSchema = z.object({
  merchantCountry: optional(z.string()),
  marketName: optional(z.string()),
  acquirerRegion: optional(z.string()),
})

const PaymentGatewayApiResponseSchema = z.object({
  isSuccess: z.boolean(),
  responseCode: optional(z.string()),
  responseDescription: optional(z.string()),
  responseTime: optional(z.string()), // HH:mm:ss
  correlationID: optional(z.string()),
})

const PaymentGatewaySuccessSchema = PaymentGatewayApiResponseSchema.extend({
  isSuccess: z.literal(true),
})

const PaymentGatewayErrorSchema = PaymentGatewayApiResponseSchema.extend({
  isSuccess: z.literal(false),
})

/**
 * Card payment (charge) success: full transaction data. Since 19 Nov 2026 the
 * gateway leaves maskedCardNumber out of Apple Pay and Google Pay charges, so
 * an approved charge is accepted without it. The card's last four digits
 * (lastFourInPan, returned for token transactions) stand in for it, or an
 * empty string when those are missing too, for what stores it and the PAN
 * sent to FJS, which only holds the card's last digits and is optional there.
 */
export const CardPaymentSuccessSchema = PaymentGatewaySuccessSchema.extend({
  isSuccess: z.literal(true),
  // Stored with the payment and sent to FJS, or used to refund the charge
  acquirerReferenceNumber: z.string(),
  authorizationCode: z.string(),
  transactionID: optional(z.string()),
  transactionLifecycleId: optional(z.string()),
  maskedCardNumber: optional(z.string()),
  lastFourInPan: optional(z.string()),
  cardInformation: CardInformationSchema,
  transactionType: optional(z.string()),
  isCardPresent: optional(z.boolean()),
  currency: optional(z.string()),
  authenticationMethod: optional(z.string()),
  authorizedAmount: optional(z.number()),
  marketInformation: optional(MarketInformationSchema),
  authorizationIdentifier: optional(z.string()),
}).transform(({ maskedCardNumber, lastFourInPan, ...charge }) => ({
  ...charge,
  maskedCardNumber:
    maskedCardNumber ?? (lastFourInPan ? `************${lastFourInPan}` : ''),
}))

/** Card payment (charge) error: transaction fields omitted or partial */
export const CardPaymentErrorSchema = PaymentGatewayErrorSchema

/**
 * Refund success. Nothing reads the transaction data of a refund, it is only
 * kept in the refund event's metadata, so a refund the gateway approved is
 * accepted whatever of it comes back. Requiring it turned approved refunds
 * into failures when the gateway left acquirerReferenceNumber and
 * authorizationIdentifier out (19 Nov 2026): the retry then failed, as the
 * payment was refunded already, and the rollback kept a refunded payment paid.
 */
export const RefundSuccessSchema = PaymentGatewaySuccessSchema.extend({
  isSuccess: z.literal(true),
  acquirerReferenceNumber: optional(z.string()),
  transactionID: optional(z.string()),
  transactionLifecycleId: optional(z.string()),
  maskedCardNumber: optional(z.string()),
  cardInformation: optional(UnreadCardInformationSchema),
  authorizationIdentifier: optional(z.string()),
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
    // The payer's browser posts verificationFields to postUrl for 3-D Secure
    postUrl: z.string(),
    verificationFields: z.array(FieldSchema),
    cardVerificationRawResponse: optional(z.string()),
    additionalFields: optional(z.array(FieldSchema)),
    scriptPath: optional(z.string()),
    cardInformation: optional(UnreadCardInformationSchema),
    threeDSMessageVersion: optional(z.string()),
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

/** Valitor Apple Pay decrypted payment token payload (Sale operation with DecryptedPaymentTokenData) */
const ApplePayDecryptedPaymentTokenDataSchema = z.object({
  amount: z.string(),
  cardNumber: z.string(),
  currency: z.string(),
  expirationMonth: z.number(),
  expirationYear: z.number(),
  paymentCryptogram: z.string(),
})

export const ApplePayDecryptedWalletPaymentPayloadSchema = z.object({
  operation: z.literal('Sale'),
  walletPaymentType: z.literal('ApplePay'),
  applePayWalletPayment: z.object({
    decryptedPaymentTokenData: ApplePayDecryptedPaymentTokenDataSchema,
  }),
  paymentAdditionalData: z.object({
    merchantReferenceData: z.string(),
  }),
  systemCalling: z.string(),
  correlationId: z.string(),
})

export type ApplePayDecryptedWalletPaymentPayload = z.infer<
  typeof ApplePayDecryptedWalletPaymentPayloadSchema
>

/**
 * Google Pay token decrypted by Valitor: Q8 and the card of a token saved in
 * the Google account, to go through 3-D Secure and be charged like a typed card
 */
export const GooglePayDecryptionSuccessSchema =
  PaymentGatewaySuccessSchema.extend({
    responseCode: z.literal('Q8'),
    // Not observed against UAT yet (it answers Q9), so the month and year are
    // taken as numbers or strings and the year as two or four digits. The
    // card then carries the four-digit year a typed card is charged with.
    googlePayCardInformation: z.object({
      pan: z.string(),
      expirationMonth: z.coerce.number().int().min(1).max(12),
      expirationYear: z.coerce
        .number()
        .int()
        .transform((year) => (year < 100 ? 2000 + year : year)),
    }),
  })

export const GooglePayDecryptionErrorSchema = PaymentGatewayErrorSchema

/**
 * What Valitor answers a Google Pay WalletTransaction with: Q8 and the card
 * for a token of a card saved in the Google account (PAN_ONLY), the payment
 * itself for a device token (CRYPTOGRAM_3DS), which it charges outright.
 */
export const GooglePayWalletTransactionSuccessSchema = z.union([
  GooglePayDecryptionSuccessSchema,
  CardPaymentSuccessSchema,
])

export type GooglePayCardInformation = z.infer<
  typeof GooglePayDecryptionSuccessSchema
>['googlePayCardInformation']

/** The two outcomes of a Google Pay WalletTransaction, see GooglePayWalletTransactionSuccessSchema */
export type GooglePayWalletTransactionOutcome =
  | { outcome: 'card'; card: GooglePayCardInformation }
  | { outcome: 'charged'; paymentResult: CardPaymentSuccessResponse }
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
