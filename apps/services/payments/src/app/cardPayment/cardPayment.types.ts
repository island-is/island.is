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
    outOfScaScope: boolean
  }
  scriptPath: string
  responseCode: string
  responseDescription: string
  responseTime: string
  correlationID: string
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
