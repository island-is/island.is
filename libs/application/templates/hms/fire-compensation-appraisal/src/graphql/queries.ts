import { gql } from '@apollo/client'

export const getPropertiesByPropertyCodeQuery = gql`
  query GetPropertiesByPropertyCode($input: HmsPropertyByPropertyCodeInput!) {
    hmsPropertyByPropertyCode(input: $input)
  }
`
