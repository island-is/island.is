import { gql } from '@apollo/client'

export const USER_PROFILE = gql`
  query GetUserProfile {
    getUserProfile {
      nationalId
      mobilePhoneNumber
      locale
      email
      bankInfo
      emailStatus
      mobileStatus
      modified
      emailNotifications
    }
  }
`
