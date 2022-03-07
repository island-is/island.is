import { gql } from '@apollo/client'

export const USER_PROFILE_STATUS = gql`
  query GetUserProfileStatus {
    getUserProfileStatus {
      hasModifiedDateLate
      hasData
    }
  }
`
