import { gql } from '@apollo/client'

export const PAYMENT_STATUS = gql`
  query GetPaymentStatus($input: PaymentStatusInput!) {
    formSystemPaymentStatus(input: $input) {
      fulfilled
      paymentUrl
    }
  }
`
