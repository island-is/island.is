import { gql } from '@apollo/client'

export const CONFIRM_SMS_VERIFICATION = gql`
  mutation confirmSmsVerification($input: ConfirmSmsVerificationInput!) {
    confirmSmsVerification(input: $input) {
      message
      confirmed
    }
  }
`
