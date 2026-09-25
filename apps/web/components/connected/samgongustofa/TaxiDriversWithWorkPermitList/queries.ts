import gql from 'graphql-tag'

export const GET_TAXI_DRIVERS_WITH_WORK_PERMIT_QUERY = gql`
  query GetTaxiDriversWithWorkPermit {
    getTaxiDriversWithWorkPermit {
      drivers {
        id
        name
      }
    }
  }
`
