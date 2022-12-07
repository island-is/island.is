import { gql } from '@apollo/client'
import { VehicleDebtStatusByPermno } from '@island.is/api/schema'
import { GET_VEHICLE_DEBT_STATUS_BY_PERMNO } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyVehicleDetails = () => {
  return useLazyQuery<
    {
      vehicleDebtStatusByPermno: VehicleDebtStatusByPermno
    },
    {
      permno: string
    }
  >(
    gql`
      ${GET_VEHICLE_DEBT_STATUS_BY_PERMNO}
    `,
  )
}
