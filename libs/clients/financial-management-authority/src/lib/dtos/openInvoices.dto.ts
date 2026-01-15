import { InvoiceDto } from './invoice.dto'
import { PageInfoDto } from '@island.is/nest/pagination'

export interface OpenInvoicesDto {
  invoices: Array<InvoiceDto> | null
  pageInfo: PageInfoDto
  totalCount: number
}
