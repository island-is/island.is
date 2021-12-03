import { gql } from '@apollo/client'

export const USER_PROFILE_AND_ISLYKILL = gql`
  fragment GetUserProfile on Query {
    getUserProfile {
      locale
      emailVerified
      email
      mobilePhoneNumber
      mobilePhoneNumberVerified
    }
  }

  fragment GetIslykillSettings on Query {
    getIslykillSettings {
      bankInfo
      canNudge
      noUserFound
    }
  }

  query GetTestQueryCombined {
    ...GetUserProfile
    ...GetIslykillSettings
  }
`
