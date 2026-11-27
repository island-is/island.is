import { gql } from '@apollo/client'

export const GET_FAMILY_MEMBERS = gql`
  query GetFamilyMembers {
    nationalRegistryPerson {
      spouse {
        nationalId
        fullName
        maritalStatus
      }
    }
  }
`
