import gql from 'graphql-tag'

export const GET_TAXI_DRIVERS_WITH_OPERATING_LICENCE_QUERY = gql`
  query GetTaxiDriversWithOperatingLicence {
    getTaxiDriversWithOperatingLicence {
      drivers {
        id
        name
        stationName
        stationId
        representativeName
      }
    }
  }
`
