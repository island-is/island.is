import { gql } from '@apollo/client'

export const CREATE_PAYMENT = gql`
  mutation CreateFormSystemPayment(
    $input: CreateFormSystemPaymentRequestInput!
  ) {
    createFormSystemPayment(input: $input) {
      id
      paymentUrl
    }
  }
`
