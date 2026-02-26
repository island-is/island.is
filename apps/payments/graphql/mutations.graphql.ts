import gql from 'graphql-tag'

export const VerifyCardMutation = gql`
  mutation verifyCard($input: PaymentsVerifyCardInput!) {
    paymentsVerifyCard(input: $input) {
      cardVerificationRawResponse
      postUrl
      verificationFields {
        name
        value
      }
      additionalFields {
        name
        value
      }
      isSuccess
      scriptPath
      responseCode
    }
  }
`

export const VerificationCallbackMutation = gql`
  mutation verificationCallback(
    $input: PaymentsCardVerificationCallbackInput!
  ) {
    paymentsVerificationCallback(input: $input) {
      paymentFlowId
    }
  }
`

export const ChargeCardMutation = gql`
  mutation chargeCard($input: PaymentsChargeCardInput!) {
    paymentsChargeCard(input: $input) {
      isSuccess
      responseCode
    }
  }
`

export const CreateInvoiceMutation = gql`
  mutation createInvoice($input: PaymentsCreateInvoiceInput!) {
    paymentsCreateInvoice(input: $input) {
      isSuccess
      responseCode
    }
  }
`
