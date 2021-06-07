export interface PaymentType {
  id: string,
  applicationId: string,
  fulfilled: boolean,
  referenceId: string,
  user4: string,
  definition: string,
  amount: number,
  expiresAt: Date,
}
