import gql from 'graphql-tag'

export const GetUsersVehiclesV2Query = gql`
  query GetUsersVehiclesV2($input: GetVehiclesListV2Input!) {
    vehiclesListV2(input: $input) {
      vehicleList {
        permno
        make
        colorName
        modelYear
        requiresMileageRegistration
        canRegisterMilage
        role
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
