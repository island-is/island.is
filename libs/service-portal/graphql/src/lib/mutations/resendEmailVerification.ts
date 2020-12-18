import { gql } from '@apollo/client'

export const RESEND_EMAIL_VERIFICATION = gql`
  mutation resendEmailVerification {
    resendEmailVerification {
      created
    }
  }
`
