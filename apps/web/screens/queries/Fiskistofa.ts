import gql from 'graphql-tag'

export const GET_SINGLE_SHIP = gql`
  query FiskistofaGetSingleShip($input: FiskistofaGetSingleShipInput!) {
    fiskistofaGetSingleShip(input: $input) {
      fiskistofaSingleShip {
        shipNumber
        name
        ownerName
        ownerSsn
        operatorName
        operatorSsn
        operatingCategory
        grossTons
      }
    }
  }
`
