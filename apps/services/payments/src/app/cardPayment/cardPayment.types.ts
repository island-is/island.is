export interface VerificationResponse {
  cardVerificationRawResponse: string
  postUrl: string
  verificationFields: { name: string; value: string }[]
  additionalFields: { name: string; value: string }[]
  isSuccess: true
  cardInformation: {
    cardScheme: string
    issuingCountry: string
    cardUsage: string
    cardCategory: string
    outOfScaScope: string
    cardProductCategory: string
  }
  scriptPath: string
  responseCode: string
  responseDescription: string
  responseTime: string
  correlationId: string
}

export interface ChargeResponse {
  acquirerReferenceNumber: string
  transactionID: string
  authorizationCode: string
  transactionLifecycleId: string
  maskedCardNumber: string
  isSuccess: true
  cardInformation: {
    cardScheme: string
    issuingCountry: string
    cardUsage: string
    cardCategory: string
    outOfScaScope: string
    cardProductCategory: string
  }
  authorizationIdentifier: string
  responseCode: string
  responseDescription: string
  responseTime: string
  correlationId: string
}

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

export enum CardErrorCode {
  InsufficientFunds = 'insufficient_funds',
  ExpiredCard = 'expired_card',
  InvalidCardNumber = 'invalid_card_number',
  InvalidCardExpiry = 'invalid_card_expiry',
  InvalidCardCVC = 'invalid_card_cvc',
  InvalidCard = 'invalid_card',
  LostCard = 'lost_card',
  StolenCard = 'stolen_card',
  ClosedAccount = 'closed_account',
  TransactionNotPermitted = 'transaction_not_permitted',
  RestrictedCard = 'restricted_card',
  SuspectedFraud = 'suspected_fraud',
  ExceedsWithdrawalLimit = 'exceeds_withdrawal_limit',
  SecurityViolation = 'security_violation',
  AdditionalAuthenticationRequired = 'additional_authentication_required',
  ContactIssuer = 'contact_issuer',
  IssuerUnavailable = 'issuer_unavailable',
  DuplicateTransaction = 'duplicate_transaction',
  TransactionTimedOut = 'transaction_timed_out',
  StopPaymentOrder = 'stop_payment_order',
  RevocationOfAuthorization = 'revocation_of_authorization',
  RevocationOfAllAuthorizations = 'revocation_of_all_authorizations',
  PaymentSystemUnavailable = 'payment_system_unavailable',
  GenericDecline = 'generic_decline',
  Unknown = 'unknown',
}
