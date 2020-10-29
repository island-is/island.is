import { gql } from '@apollo/client'

export const CONFIRM_EMAIL_VERIFICATION = gql`
  mutation confirmEmailVerification($input: ConfirmEmailVerificationInput!) {
    confirmEmailVerification(input: $input) {
      message
      confirmed
    }
  }
`
