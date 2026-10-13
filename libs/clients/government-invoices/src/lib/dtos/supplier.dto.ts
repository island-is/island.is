import { SupplierResponseDto } from '../../../gen/fetch'

export interface SupplierDto {
  legalId: string
  name: string
}

export const mapSupplierDto = (
  supplier: SupplierResponseDto,
): SupplierDto | null => {
  if (!supplier.legalId || !supplier.name) {
    return null
  }

  return {
    legalId: supplier.legalId,
    name: supplier.name,
  }
}
