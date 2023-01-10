import { gql } from '@apollo/client'

export const GET_REAL_ESTATE_ADDRESS = gql`
  query getRealEstateAddress($input: String!) {
    getRealEstateAddress(input: $input) {
      name
    }
  }
`
