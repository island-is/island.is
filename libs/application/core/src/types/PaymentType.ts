export interface PaymentType {
  id: string,
  applicationId: string,
  fulfilled: boolean,
  referenceId: string,
  user4: string,
  definition: object,
  amount: number,
  expiresAt: Date,
}
