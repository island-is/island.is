import { PageInfoDto } from '@island.is/nest/pagination'
import { InvoicePaymentTypeGroupDto } from './invoicePaymentTypeGroup.dto'

export interface InvoicePaymentTypeGroupsDto {
  invoicePaymentTypeGroups: Array<InvoicePaymentTypeGroupDto>
  pageInfo: PageInfoDto
  totalCount: number
}
