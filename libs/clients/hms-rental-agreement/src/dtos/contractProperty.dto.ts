import { ContractProperty as GeneratedContractProperty } from '../../gen/fetch'

export interface ContractPropertyDto {
  id: number
  propertyId: number
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
    postalCode: data.postalCode ?? undefined,
    streetAndHouseNumber: data.streetAndHouseNumber ?? undefined,
    municipality: data.municipality ?? undefined,
  }
}
