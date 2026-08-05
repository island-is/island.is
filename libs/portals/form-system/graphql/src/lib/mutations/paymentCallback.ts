import { gql } from '@apollo/client'

export const PAYMENT_CALLBACK = gql`
  mutation PaymentCallbackFormSystem($input: PaymentCallbackInput!) {
    paymentCallbackFormSystem(input: $input)
  }
`
