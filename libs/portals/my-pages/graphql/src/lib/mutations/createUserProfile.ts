import { gql } from '@apollo/client'

export const CREATE_USER_PROFILE = gql`
  mutation createProfile($input: CreateUserProfileInput!) {
    createProfile(input: $input) {
      nationalId
      mobilePhoneNumber
      locale
      email
    }
  }
`
