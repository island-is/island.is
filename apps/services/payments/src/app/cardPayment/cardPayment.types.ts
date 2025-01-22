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
}

export interface SavedVerificationPendingData {
  paymentFlowId: string
  amount: number
}

export interface SavedVerificationCompleteData {
  cavv: string
  mdStatus: string
  xid: string
  dsTransId: string
}

export interface MdSerialized {
  c: string // payment transaction correlation id
  pi: string // payment flow id
  a: number // amount
  iat: number
}

export interface MdNormalised {
  correlationId: string
  paymentFlowId: string
  amount: number
  issuedAt: number
}
