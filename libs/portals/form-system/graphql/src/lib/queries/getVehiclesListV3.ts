import { gql } from '@apollo/client'

export const GET_VEHICLES_LIST_V3 = gql`
  query vehiclesListV3($input: VehiclesListInputV3!) {
    vehiclesListV3(input: $input) {
      pageNumber
      pageSize
      totalPages
      totalRecords
      vehicleList {
        vehicleId
        make
        color {
          code
          name
        }
        registration {
          number
        }
      }
    }
  }
`
