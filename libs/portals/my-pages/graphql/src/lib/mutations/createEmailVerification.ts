import { gql } from '@apollo/client'

export const CREATE_EMAIL_VERIFICATION = gql`
  mutation createEmailVerification($input: CreateEmailVerificationInput!) {
    createEmailVerification(input: $input) {
      created
    }
  }
`

export const CREATE_ME_EMAIL_VERIFICATION = gql`
  mutation createMeEmailVerification($input: CreateEmailVerificationInput!) {
    createMeEmailVerification(input: $input) {
      created
    }
  }
`
