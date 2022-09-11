import gql from 'graphql-tag'

export const GET_SHIPS_QUERY = gql`
  query GetShips($input: GetShipsInput!) {
    getShips(input: $input) {
      id
      name
      shippingCompany
      shippingClass
      homePort
    }
  }
`
