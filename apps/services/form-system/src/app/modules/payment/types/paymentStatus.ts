export interface PaymentStatus {
  fulfilled: boolean
  paymentUrl: string
  paymentId: string
}

export type PaymentStatusCodes = 'In progress' | 'unpaid' | 'cancelled' | 'paid'
