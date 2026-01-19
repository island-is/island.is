import { SupplierResponseDto } from '../../../gen/fetch'

export interface SupplierDto {
  id: number
  name: string
  isPrivateProxy: boolean
  isConfidential: boolean
}

export const mapSupplierDto = (
  supplier: SupplierResponseDto,
): SupplierDto | null => {
  if (
    !supplier.id ||
    !supplier.name ||
    supplier.isPrivateProxy === undefined ||
    supplier.isConfidential === undefined
  ) {
    return null
  }

  return {
    id: supplier.id,
    name: supplier.name,
    isPrivateProxy: supplier.isPrivateProxy,
    isConfidential: supplier.isConfidential,
  }
}
