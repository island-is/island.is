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
  const contractPropertyId = data?.contractPropertyId ?? undefined
  const propertyId = data?.propertyId ?? undefined
  if (contractPropertyId === undefined || propertyId === undefined) {
    return null
  }

  return {
    id: contractPropertyId,
    propertyId: propertyId,
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
