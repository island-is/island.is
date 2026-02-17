export interface PaymentType {
  id: string
  applicationId: string
  fulfilled: boolean
  referenceId: string
  user4: string
  definition: object
  amount: number
  expiresAt: Date
  requestId?: string
}

export interface BasicChargeItem {
  code: string
  quantity?: number
  amount?: number // Is used to set a dynamic charge amount based on the application data
}
