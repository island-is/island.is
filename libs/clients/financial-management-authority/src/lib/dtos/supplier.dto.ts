import { SupplierResponseDto } from '../../../gen/fetch'

export interface SupplierDto {
  id: number
  name: string
}

export const mapSupplierDto = (
  supplier: SupplierResponseDto,
): SupplierDto | null => {
  if (!supplier.id || !supplier.name) {
    return null
  }

  return {
    id: supplier.id,
    name: supplier.name,
  }
}
