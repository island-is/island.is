import { SupplierResponseDto } from '../../../gen/fetch'

export interface SupplierDto {
  legalId: string
  name: string
  isPrivatePerson: boolean
  isPrivatePersonProxy: boolean
  isConfidential: boolean
}

export const mapSupplierDto = (
  supplier: SupplierResponseDto,
): SupplierDto | null => {
  if (
    !supplier.legalId ||
    !supplier.name ||
    supplier.isPrivatePerson === undefined ||
    supplier.isPrivatePersonProxy === undefined ||
    supplier.isConfidential === undefined
  ) {
    return null
  }

  return {
    legalId: supplier.legalId,
    name: supplier.name,
    isPrivatePerson: supplier.isPrivatePerson,
    isPrivatePersonProxy: supplier.isPrivatePersonProxy,
    isConfidential: supplier.isConfidential,
  }
}
