import { gql } from '@apollo/client'

export const PAYMENT_STATUS = gql`
  query status($applicationId: String!) {
    applicationPaymentStatus(applicationId: $applicationId) {
      fulfilled
      paymentUrl
    }
  }
`
