import { gql } from '@apollo/client'

export const DELETE_EMAIL_OR_PHONE_MUTATION = gql`
  mutation deleteEmailOrPhone($input: DeleteEmailOrPhoneInput!) {
    deleteEmailOrPhone(input: $input) {
      nationalId
    }
  }
`
