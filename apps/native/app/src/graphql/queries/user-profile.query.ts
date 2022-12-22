import {gql} from "@apollo/client";

export const USER_PROFILE_QUERY = gql`
  query {
    getUserProfile {
      nationalId
      locale
      documentNotifications
      mobilePhoneNumber
      mobileStatus
      email
      emailStatus
      bankInfo
      modified
      canNudge
      modified
    }
  }
`
