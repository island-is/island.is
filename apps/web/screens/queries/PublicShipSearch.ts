import gql from 'graphql-tag'

export const PUBLIC_SHIP_SEARCH_QUERY = gql`
  query GetPublicShipSearch($input: ShipRegistryShipSearchInput!) {
    shipRegistryShipSearch(input: $input) {
      ships {
        shipName
        shipType
        regno
        region
        portOfRegistry
        regStatus
        grossTonnage
        length
        manufactionYear
        manufacturer
        opid
        owners {
          name
          nationalId
          sharePercentage
        }
      }
    }
  }
`
