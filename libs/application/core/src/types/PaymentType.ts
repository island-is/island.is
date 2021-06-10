export interface PaymentType {
  id: string,
  application_id: string,
  fulfilled: boolean,
  reference_id: string,
  user4: string,
  definition: string,
  amount: number,
  expires_at: Date,
}
