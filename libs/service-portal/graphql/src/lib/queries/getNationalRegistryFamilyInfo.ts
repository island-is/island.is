import { gql } from '@apollo/client'

export const NATIONAL_REGISTRY_FAMILY_INFO = gql`
  query GetMyFamily($input: GetMyInfoInput!) {
    getMyFamily(input: $input) {
      nationalId
      fullName
      gender
      address
      maritalStatus
    }
  }
`
