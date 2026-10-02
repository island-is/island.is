import {
  InvoicePaymentTypeGroupDto,
  InvoicePaymentTypeGroupsDto,
} from '@island.is/clients/government-invoices'
import { InvoicePaymentTypeGroup } from '../models/invoicePaymentTypeGroup.model'
import { InvoicePaymentTypeGroupCollection } from '../models/invoicePaymentTypeGroups.model'
import { buildInvoicePaymentTypeGroupId } from '../utils/invoicePaymentTypeGroupId'

export const mapInvoicePaymentTypeGroup = (
  data: InvoicePaymentTypeGroupDto,
): InvoicePaymentTypeGroup => ({
  id: buildInvoicePaymentTypeGroupId(data.name, data.codes),
  name: data.name,
  codes: data.codes,
  codeCount: data.codeCount ?? undefined,
  l3CategoryName: data.l3CategoryName ?? undefined,
})

export const mapInvoicePaymentTypeGroups = (
  data: InvoicePaymentTypeGroupsDto,
): InvoicePaymentTypeGroupCollection => {
  const groups: InvoicePaymentTypeGroup[] = data.invoicePaymentTypeGroups.map(
    mapInvoicePaymentTypeGroup,
  )

  return {
    totalCount: data.totalCount,
    pageInfo: data.pageInfo,
    data: groups,
  }
}
