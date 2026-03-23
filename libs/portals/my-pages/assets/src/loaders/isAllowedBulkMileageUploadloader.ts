import { Query } from '@island.is/api/schema'
import { gql } from '@apollo/client'
import type { WrappedLoaderFn } from '@island.is/portals/core'

export const GET_VEHICLE_COUNT_QUERY = gql`
  query VehiclesListCount($input: VehiclesListInputV3!) {
    vehiclesListV3(input: $input) {
      pageNumber
      pageSize
      totalPages
      totalRecords
    }
  }
`

export const isAllowedBulkMileageUploadLoader: WrappedLoaderFn =
  ({ client }) =>
  async () => {
    const { data } = await client.query<Query>({
      query: GET_VEHICLE_COUNT_QUERY,
      variables: {
        input: {
          page: 1,
          pageSize: 10,
          filterOnlyVehiclesUserCanRegisterMileage: true,
          includeNextMainInspectionDate: false,
        },
      },
    })
    const totalVehicles = data?.vehiclesListV3?.totalRecords ?? 0

    if (totalVehicles > 10) {
      return true
    }
    return false
  }
