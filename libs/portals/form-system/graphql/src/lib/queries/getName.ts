import { gql } from '@apollo/client'

export const GET_NAME_BY_NATIONALID = gql`
  query formSystemNameByNationalId(
    $input: String!
    ) {
    formSystemNameByNationalId(input: $input) {
      fulltNafn
    }
  }
`