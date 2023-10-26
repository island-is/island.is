import { gql } from '@apollo/client'
import {
  MachineDetails,
  MachineDetailsInput,
  VehicleOwnerchangeChecksByPermno,
} from '@island.is/api/schema'
import {
  GET_MACHINE_DETAILS,
  GET_VEHICLE_OWNERCHANGE_CHECKS_BY_PERMNO,
} from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

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
      input: MachineDetailsInput
    }
  >(
    gql`
      ${GET_MACHINE_DETAILS}
    `,
  )
}
