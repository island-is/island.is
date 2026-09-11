import { PageInfoDto } from '@island.is/nest/pagination'
import { SupplierDto } from './supplier.dto'

export interface SuppliersDto {
  suppliers: Array<SupplierDto>
  pageInfo: PageInfoDto
  totalCount: number
}
