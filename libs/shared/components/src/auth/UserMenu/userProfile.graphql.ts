import { gql } from '@apollo/client'

export const USER_PROFILE = gql`
  query GetUserProfile {
    getUserProfile {
      email
      mobilePhoneNumber
    }
  }
`

export const UPDATE_USER_PROFILE = gql`
  mutation updateUserProfile($input: UpdateUserProfileInput!) {
    updateProfile(input: $input) {
      locale
      nationalId
    }
  }
`
