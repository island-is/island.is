import gql from 'graphql-tag'

export const GetVehiclesListV2Query = gql`
  query GetVehiclesListV2($input: GetVehiclesListV2Input!) {
    vehiclesListV2(input: $input) {
      vehicleList {
        permno
        make
        latestMileage
      }
      paging {
        pageNumber
        pageSize
        totalPages
        totalRecords
      }
    }
  }
`
