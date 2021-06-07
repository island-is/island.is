export interface ChargeResult {
  success: boolean
  error: Error | null
  data?: {
    paymentUrl: string
    user4: string
    receptionID: string
  }
}
