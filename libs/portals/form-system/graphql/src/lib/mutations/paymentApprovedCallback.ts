import { gql } from '@apollo/client'

export const PAYMENT_APPROVED_CALLBACK = gql`
  mutation PaymentApprovedCallbackFormSystem($input: PaymentApprovedInput!) {
    paymentApprovedCallbackFormSystem(input: $input)
  }
`
