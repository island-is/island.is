import { gql } from '@apollo/client'

export const CONFIRM_EMAIL_VERIFICATION = gql`
  mutation confirmEmailVerification($input: confirmEmailVerificationInput!) {
    confirmEmailVerification(input: $input) {
      nationalId
      hash
    }
  }
`
