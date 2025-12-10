import { gql } from '@apollo/client'

export const GET_ADDRESS_BY_NATIONALID = gql`
  query formSystemHomeByNationalId($input: String!) {
    formSystemHomeByNationalId(input: $input) {
      heimilisfang {
        postnumer
        husHeiti
      }
    }
  }
`
