import { PageInfoDto } from '@island.is/nest/pagination'
import { InvoiceTypeDto } from './invoiceType.dto'

export interface InvoiceTypesDto {
  invoiceTypes: Array<InvoiceTypeDto>
  pageInfo: PageInfoDto
  totalCount: number
}
