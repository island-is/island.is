import gql from 'graphql-tag'

export const GET_TAXI_STATIONS_QUERY = gql`
  query GetTaxiStations {
    getTaxiStations {
      stations {
        id
        name
        driverCount
      }
    }
  }
`
