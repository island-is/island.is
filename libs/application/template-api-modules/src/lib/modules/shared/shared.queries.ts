export const PAYMENT_STATUS_QUERY = `
  query($applicationId: String!) {
    applicationPaymentStatus(applicationId: $applicationId) {
      fulfilled
    }
  }
`

export interface PaymentStatusData {
  applicationPaymentStatus: { fulfilled: boolean }
}
