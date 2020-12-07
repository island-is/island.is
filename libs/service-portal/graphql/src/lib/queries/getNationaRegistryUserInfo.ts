import { gql } from '@apollo/client'

export const NATIONAL_REGISTRY_INFO = gql`
  query NationalRegistryUserQuery {
    nationalRegistry {
      nationalId
      fullName
      gender
      legalResidence
      birthPlace
      citizenship
      religion
      maritalStatus
    }
  }
`
