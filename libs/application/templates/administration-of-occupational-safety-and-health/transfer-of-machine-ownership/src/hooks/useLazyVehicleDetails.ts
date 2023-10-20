import { gql } from '@apollo/client'
import { VehicleOwnerchangeChecksByPermno } from '@island.is/api/schema'
import {
  GET_MACHINE_DETAILS,
  GET_VEHICLE_OWNERCHANGE_CHECKS_BY_PERMNO,
} from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'
import { MachineDetails } from '../shared'

export const useLazyVehicleDetails = () => {
  return useLazyQuery<
    {
      vehicleOwnerchangeChecksByPermno: VehicleOwnerchangeChecksByPermno
    },
    {
      permno: string
    }
  >(
    gql`
      ${GET_VEHICLE_OWNERCHANGE_CHECKS_BY_PERMNO}
    `,
  )
}

export const useLazyMachineDetails = () => {
  return useLazyQuery<
    {
      machineDetails: MachineDetails
    },
    {
      id: string
    }
  >(
    gql`
      ${GET_MACHINE_DETAILS}
    `,
  )
}
