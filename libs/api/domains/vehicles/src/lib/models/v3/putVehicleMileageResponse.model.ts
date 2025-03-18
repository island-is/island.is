import { createUnionType } from '@nestjs/graphql'
import { VehiclesMileageUpdateError } from './vehicleMileageResponseError.model'
import { VehicleMileagePutModel } from '../getVehicleMileage.model'

export const VehicleMileagePutResponse = createUnionType({
  name: 'VehicleMileagePutResponse',
  types: () => [VehicleMileagePutModel, VehiclesMileageUpdateError] as const,
  resolveType(value) {
    if ('permno' in value && value.permno !== undefined) {
      return VehicleMileagePutModel
    }

    return VehiclesMileageUpdateError
  },
})
