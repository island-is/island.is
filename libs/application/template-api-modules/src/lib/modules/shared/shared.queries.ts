export const PAYMENT_QUERY = `
  mutation($input: ApplicationPaymentChargeInput!) {
    applicationPaymentCharge(input: $input) {
      id
      paymentUrl
    }
  }
`

export interface PaymentChargeData {
  applicationPaymentCharge?: { id: string; paymentUrl: string }
}

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

export const ADD_ATTACHMENT_MUTATION = `
  mutation($input: AddAttachmentInput!) {
    addAttachment(input: $input) {
      id
    }
  }
`
