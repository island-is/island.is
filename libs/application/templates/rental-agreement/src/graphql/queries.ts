import { gql } from '@apollo/client'

export const ADDRESS_SEARCH_QUERY = gql`
  query AddressSearchQuery($input: HmsSearchInput!) {
    hmsSearch(input: $input) {
      addresses {
        address
        addressCode
        municipalityName
        municipalityCode
        postalCode
        landCode
        streetName
        streetNumber
      }
    }
  }
`
