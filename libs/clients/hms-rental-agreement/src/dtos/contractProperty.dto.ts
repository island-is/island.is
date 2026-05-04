import { type ContractProperty } from '../../gen/fetch'
import { type RentalPropertyType } from '../types'

export interface ContractPropertyDto {
  id: number
  propertyId: number
  type: RentalPropertyType
  postalCode?: number
  streetAndHouseNumber?: string
  municipality?: string
}

export const mapContractPropertyDto = (
  data: ContractProperty,
): ContractPropertyDto | null => {
  if (!data.contract_property_id || !data.property_id) return null
  return {
    id: data.contract_property_id,
    propertyId: data.property_id,
    type: mapPropertyType(data.special_type_code),
    postalCode: data.postal_code ?? undefined,
    streetAndHouseNumber: data.street_and_house_number ?? undefined,
    municipality: data.municipality ?? undefined,
  }
}

const mapPropertyType = (type?: string | null): RentalPropertyType => {
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
