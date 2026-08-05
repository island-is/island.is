export interface PaymentType {
  id: string
  application_id: string
  fulfilled: boolean
  reference_id: string
  user4: string
  definition: object
  amount: number
  request_id?: string
  payment_method?: string
}
