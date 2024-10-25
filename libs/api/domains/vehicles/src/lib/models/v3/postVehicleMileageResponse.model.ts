import { createUnionType } from '@nestjs/graphql'
import { VehicleMileageDetail } from '../getVehicleMileage.model'
import { VehiclesMileageUpdateError } from './vehicleMileageResponseError.model'

export const VehicleMileagePostResponse = createUnionType({
  name: 'VehicleMileagePostResponse',
  types: () => [VehicleMileageDetail, VehiclesMileageUpdateError] as const,
  resolveType(value) {
    if ('permno' in value && value.permno !== undefined) {
      return VehicleMileageDetail
    }

    return VehiclesMileageUpdateError
  },
})
