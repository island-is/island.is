import { gql } from '@apollo/client'

export const NATIONAL_REGISTRY_INFO = gql`
  query GetMyInfo($input: GetMyInfoInput!) {
    getMyInfo(input: $input) {
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
