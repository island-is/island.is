import gql from 'graphql-tag'

export const GET_ALL_AIRCRAFTS_QUERY = gql`
  query GetAllAircrafts($input: AircraftRegistryAllAircraftsInput!) {
    aircraftRegistryAllAircrafts(input: $input) {
      pageSize
      pageNumber
      totalCount
      aircrafts {
        identifiers
        type
        maxWeight
        operator {
          address
          city
          country
          name
          postcode
        }
        owners {
          address
          city
          country
          name
          postcode
        }
        productionYear
        registrationNumber
        serialNumber
      }
    }
  }
`
