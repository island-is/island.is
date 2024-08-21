import { gql } from '@apollo/client'

export const GET_REAL_ESTATE_ADDRESS = gql`
  query getRealEstateAddress($input: String!) {
    getRealEstateAddress(input: $input) {
      name
    }
  }
`
export const SEARCH_FOR_PROPERTY_QUERY = gql`
  query SearchForProperty($input: SearchForPropertyInput!) {
    searchForProperty(input: $input) {
      defaultAddress {
        display
      }
    }
  }
`
