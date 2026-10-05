import { SupplierResponseDto } from '../../../gen/fetch'

export interface SupplierDto {
  legalId: string
  name: string
  isPrivatePerson?: boolean
  isPrivatePersonProxy?: boolean
  isConfidential?: boolean
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
    isPrivatePerson: supplier.isPrivatePerson ?? undefined,
    isPrivatePersonProxy: supplier.isPrivatePersonProxy ?? undefined,
    isConfidential: supplier.isConfidential ?? undefined,
  }
}
