import { SupplierResponseDto } from "../../gen/fetch"

export interface SupplierDto {
  id: number
  name: string
  legalId: string
}

export const mapSupplierDto = (
  supplier: SupplierResponseDto,
): SupplierDto | null => {
  if (!supplier.id || !supplier.name || !supplier.legalId) {
    return null
  }

  return {
    id: supplier.id,
    name: supplier.name,
    legalId: supplier.legalId,
  }
}
