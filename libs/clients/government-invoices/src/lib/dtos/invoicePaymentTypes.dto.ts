import { PageInfoDto } from '@island.is/nest/pagination'
import { InvoicePaymentTypeDto } from './invoicePaymentType.dto'

export interface InvoicePaymentTypesDto {
  invoicePaymentTypes: Array<InvoicePaymentTypeDto>
  pageInfo: PageInfoDto
  totalCount: number
}
