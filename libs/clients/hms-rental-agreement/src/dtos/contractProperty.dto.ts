import { ContractProperty as GeneratedContractProperty } from '../../gen/fetch'
import { RentalPropertyType } from '../types'

export interface ContractPropertyDto {
  id: number
  propertyId: number
  type: RentalPropertyType
  postalCode?: number
  streetAndHouseNumber?: string
  municipality?: string
}

export const mapContractPropertyDto = (
  data: GeneratedContractProperty,
): ContractPropertyDto | null => {
  if (!data.contractPropertyId || !data.propertyId) {
    return null
  }

  return {
    id: data.contractPropertyId,
    propertyId: data.propertyId,
    type: mapPropertyType(data.specialTypeCode ?? undefined),
    postalCode: data.postalCode ?? undefined,
    streetAndHouseNumber: data.streetAndHouseNumber ?? undefined,
    municipality: data.municipality ?? undefined,
  }
}

const mapPropertyType = (type?: string): RentalPropertyType => {
  switch (type) {
    case 'TM_SPECIAL_TYPE_INDIVIDUAL_ROOMS':
      return 'individualRoom'
    case 'TM_SPECIAL_TYPE_RESIDENTAL_PREMISE':
      return 'residential'
    case 'TM_SPECIAL_TYPE_NONRESIDENTIAL':
      return 'nonresidential'
    default:
      return 'unknown'
  }
}
