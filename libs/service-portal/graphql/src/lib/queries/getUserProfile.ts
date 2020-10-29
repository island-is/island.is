import { gql } from '@apollo/client'

export const USER_PROFILE = gql`
  query GetUserProfile($input: GetUserProfileInput!) {
    getUserProfile(input: $input) {
      nationalId
      mobilePhoneNumber
      locale
      email
      emailVerified
      mobilePhoneNumberVerified
    }
  }
`
