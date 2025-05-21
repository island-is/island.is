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
  isSuccess: boolean
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

export interface RefundResponse {
  acquirerReferenceNumber: string
  transactionID: string
  transactionLifecycleId: string
  maskedCardNumber: string
  isSuccess: true
  cardInformation: {
    cardScheme: string
    issuingCountry: string
    cardUsage: string
    cardCategory: string
    outOfScaScope: string
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
