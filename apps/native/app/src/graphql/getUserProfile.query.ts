import { gql } from '@apollo/client'

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    getUserProfile {
      nationalId
      mobilePhoneNumber
      locale
      email
      emailVerified
      mobilePhoneNumberVerified
    }
  }
`;
