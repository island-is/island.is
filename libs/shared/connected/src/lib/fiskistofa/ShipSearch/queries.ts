import gql from 'graphql-tag'

export const GET_SHIPS_QUERY = gql`
  query FiskistofaGetShips($input: FiskistofaGetShipsInput!) {
    fiskistofaGetShips(input: $input) {
      id
      name
      shippingCompany
      shippingClass
      homePort
    }
  }
`
