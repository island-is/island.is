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

export const ValidateApplePayMerchantMutation = gql`
  mutation validateApplePayMerchant(
    $input: PaymentsValidateApplePayMerchantInput!
  ) {
    paymentsValidateApplePayMerchant(input: $input) {
      session
    }
  }
`

export const ChargeApplePayMutation = gql`
  mutation chargeApplePay($input: PaymentsApplePayChargeInput!) {
    paymentsChargeApplePay(input: $input) {
      isSuccess
      responseCode
    }
  }
`

export const CreateBankTransferMutation = gql`
  mutation createBankTransfer($input: PaymentsCreateBankTransferInput!) {
    paymentsCreateBankTransfer(input: $input) {
      providerPaymentId
      scaRedirectUrl
      expiresAt
      onboardingRequired
    }
  }
`

export const VerifyBankTransferMutation = gql`
  mutation verifyBankTransfer($input: PaymentsVerifyBankTransferInput!) {
    paymentsVerifyBankTransfer(input: $input) {
      status
      message
      pendingStatus
      scaRedirectUrl
      failureReason
    }
  }
`

export const CancelBankTransferMutation = gql`
  mutation cancelBankTransfer($input: PaymentsCancelBankTransferInput!) {
    paymentsCancelBankTransfer(input: $input) {
      ok
    }
  }
`
