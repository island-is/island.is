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
      emailVerified
      mobileStatus
      mobilePhoneNumberVerified
      emailNotifications
      needsNudge
      emails {
        id
        email
        emailStatus
        primary
        isConnectedToActorProfile
      }
    }
  }
`
