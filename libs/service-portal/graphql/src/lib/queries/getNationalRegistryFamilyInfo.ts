import { gql } from '@apollo/client'

export const NATIONAL_REGISTRY_FAMILY_INFO = gql`
  query NationalRegistryFamily {
    nationalRegistryFamily {
      nationalId
      fullName
      gender
      address
      maritalStatus
      familyRelation
    }
  }
`
