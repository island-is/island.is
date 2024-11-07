import { gql } from '@apollo/client'

export const SEARCH_FOR_PROPERTY_QUERY = gql`
  query SearchForProperty($input: SearchForPropertyInput!) {
    searchForProperty(input: $input) {
      defaultAddress {
        display
      }
    }
  }
`
