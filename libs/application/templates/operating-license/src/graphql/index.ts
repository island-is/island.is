import { gql } from '@apollo/client'

export const GET_REAL_ESTATE_ADDRESS = gql`
  query getRealEstateAddress($input: String!) {
    getRealEstateAddress(input: $input) {
      name
    }
  }
`

export const IDENTITIES_QUERY = gql`
  query IdentitiesQuery($input: IdentitiesInput!) {
    identities(input: $input) {
      name
      nationalId
    }
  }
`
