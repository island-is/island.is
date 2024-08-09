import { useLazyQuery } from '@apollo/client/react'
import { GetUsersVehiclesV2Query } from '../graphql/queries'

export const useVehicles = () => {
  const [fetchVehicles, { data, loading }] = useLazyQuery(
    GetUsersVehiclesV2Query,
  )

  const getVehicles = (page: number, permno: string) => {
    fetchVehicles({
      variables: {
        input: {
          page,
          pageSize: 15,
          onlyMileage: false,
          permno,
        },
      },
      fetchPolicy: 'cache-first',
    })
  }

  return { getVehicles, data, loading }
}
