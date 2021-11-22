import { gql } from '@apollo/client'

export const USER_PROFILE = gql`
  query GetUserProfile {
    getUserProfile {
      email
      mobilePhoneNumber
    }
  }
`
