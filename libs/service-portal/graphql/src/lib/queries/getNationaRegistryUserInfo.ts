import { gql } from '@apollo/client'

export const NATIONAL_REGISTRY_INFO = gql`
  query GetMyInfo {
    getMyInfo {
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
