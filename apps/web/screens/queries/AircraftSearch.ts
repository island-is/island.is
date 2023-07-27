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
          email
          name
          phone
          postcode
          ssn
        }
        owners {
          address
          city
          country
          email
          name
          phone
          postcode
          ssn
        }
        productionYear
        registrationNumber
        serialNumber
        unregistered
        unregisteredDate
      }
    }
  }
`
