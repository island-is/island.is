import { gql } from '@apollo/client'

export const GET_FAMILY_MEMBERS = gql`
  query GetFamilyMembers {
    nationalRegistryPerson {
      biologicalChildren {
        nationalId
        fullName
        details {
          name {
            fullName
          }
        }
      }
      spouse {
        nationalId
        fullName
        maritalStatus
      }
    }
  }
`
