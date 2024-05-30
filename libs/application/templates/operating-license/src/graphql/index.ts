import { gql } from '@apollo/client'

export const GET_REAL_ESTATE_ADDRESS = gql`
  query getRealEstateAddress($input: String!) {
    getRealEstateAddress(input: $input) {
      name
    }
  }
`

export const IDENTITY_QUERY = gql`
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
    }
  }
`
