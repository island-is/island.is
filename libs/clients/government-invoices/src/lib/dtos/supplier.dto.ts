import { SupplierResponseDto } from '../../../gen/fetch'

export interface SupplierDto {
  legalId: string
  name: string
  isPrivateProxy: boolean
  isConfidential: boolean
}

export const mapSupplierDto = (
  supplier: SupplierResponseDto,
): SupplierDto | null => {
  if (
    !supplier.legalId ||
    !supplier.name ||
    supplier.isPrivateProxy === undefined ||
    supplier.isConfidential === undefined
  ) {
    return null
  }

  return {
    legalId: supplier.legalId,
    name: supplier.name,
    isPrivateProxy: supplier.isPrivateProxy,
    isConfidential: supplier.isConfidential,
  }
}
