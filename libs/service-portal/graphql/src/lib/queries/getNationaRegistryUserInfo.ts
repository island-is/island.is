import { gql } from '@apollo/client'

export const NATIONAL_REGISTRY_INFO = gql`
  query NationalRegistryUserQuery {
    nationalRegistryUser {
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
