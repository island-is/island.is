import { gql } from '@apollo/client'
import { VehicleOperatorChangeChecksByPermno } from '@island.is/api/schema'
import { GET_VEHICLE_OPERATOR_CHANGE_CHECKS_BY_PERMNO } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyVehicleDetails = () => {
  return useLazyQuery<
    {
      vehicleOperatorChangeChecksByPermno: VehicleOperatorChangeChecksByPermno
    },
    {
      permno: string
    }
  >(
    gql`
      ${GET_VEHICLE_OPERATOR_CHANGE_CHECKS_BY_PERMNO}
    `,
  )
}
