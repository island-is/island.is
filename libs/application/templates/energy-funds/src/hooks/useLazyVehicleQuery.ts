import { gql } from '@apollo/client'
import {
  EnergyFundVehicleGrant,
  EnergyFundVehicleDetailsWithGrant,
} from '@island.is/api/schema'
import {
  GET_VEHICLE_DETAILS_WITH_GRANT_BY_PERMNO,
  GET_VEHICLE_GRANT_BY_VIN,
} from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyVehicleDetails = () => {
  return useLazyQuery<
    {
      energyFundVehicleGrant: EnergyFundVehicleGrant
    },
    {
      vin: string
    }
  >(
    gql`
      ${GET_VEHICLE_GRANT_BY_VIN}
    `,
  )
}

export const useLazyVehicleDetailsWithGrantByPermno = () => {
  return useLazyQuery<
    {
      energyFundVehicleDetailsWithGrant: EnergyFundVehicleDetailsWithGrant
    },
    {
      permno: string
    }
  >(
    gql`
      ${GET_VEHICLE_DETAILS_WITH_GRANT_BY_PERMNO}
    `,
  )
}
