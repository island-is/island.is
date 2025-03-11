import { createUnionType } from '@nestjs/graphql'
import { VehiclesMileageUpdateError } from './vehicleMileageResponseError.model'
import { PutResponse } from './putResponse.model'

export const VehicleMileagePutResponse = createUnionType({
  name: 'VehicleMileagePutResponse',
  types: () => [PutResponse, VehiclesMileageUpdateError] as const,
  resolveType(value) {
    if ('internalId' in value && value.internalId !== undefined) {
      return PutResponse
    }

    return VehiclesMileageUpdateError
  },
})
