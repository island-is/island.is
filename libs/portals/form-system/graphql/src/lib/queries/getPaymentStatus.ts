import { gql } from '@apollo/client'

export const PAYMENT_STATUS = gql`
  query GetPaymentStatus($input: PaymentStatusInput!) {
    getPaymentStatus(input: $input) {
      fulfilled
      paymentUrl
    }
  }
`
