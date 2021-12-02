import { gql } from '@apollo/client'

export const USER_PRFOLIE_AND_ISLYKILL = gql`
  fragment GetUserProfile on Query {
    getUserProfile {
      locale
    }
  }

  fragment GetIslykillSettings on Query {
    getIslykillSettings {
      email
      mobile
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
