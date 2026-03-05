import { useLazyQuery } from '@apollo/client/react'
import { GetVehiclesListV2Query } from '../graphql/queries'

interface VehicleListed {
  permno?: string
  make?: string
  latestMileage?: number
}

interface VehiclePaging {
  pageNumber?: number
  pageSize?: number
  totalPages?: number
  totalRecords?: number
}

interface VehiclesListV2Response {
  vehiclesListV2: {
    vehicleList?: VehicleListed[]
    paging?: VehiclePaging
  }
}

export const useVehicles = () => {
  const [fetchVehicles, { data, loading }] =
    useLazyQuery<VehiclesListV2Response>(GetVehiclesListV2Query)

  const getVehicles = (page: number, pageSize: number, permno?: string) => {
    fetchVehicles({
      variables: {
        input: {
          page,
          pageSize,
          onlyMileage: true,
          showOwned: true,
          showCoowned: true,
          showOperated: true,
          permno: permno || undefined,
        },
      },
      fetchPolicy: 'network-only',
    })
  }

  return { getVehicles, data, loading }
}
