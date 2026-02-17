export interface PaymentType {
  id: string
  application_id: string
  fulfilled: boolean
  reference_id: string
  user4: string
  definition: object
  amount: number
  expires_at: Date
  request_id?: string
}

export interface BasicChargeItem {
  code: string
  quantity?: number
  amount?: number // Is used to set a dynamic charge amount based on the application data
}
