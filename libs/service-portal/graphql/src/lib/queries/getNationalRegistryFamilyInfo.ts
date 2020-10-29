import { gql } from '@apollo/client'

export const NATIONAL_REGISTRY_FAMILY_INFO = gql`
  query GetMyFamily {
    getMyFamily {
      nationalId
      fullName
      gender
      address
      maritalStatus
    }
  }
`
