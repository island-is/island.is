import { InvoiceTypeDto, InvoiceTypesDto } from '@island.is/clients/elfur'
import { InvoiceTypes } from '../models/invoiceTypes.model'
import { InvoiceType } from '../models/invoiceType.model'

export const mapInvoiceType = (data: InvoiceTypeDto): InvoiceType => ({
  code: data.code,
  name: data.name,
  description: data.description ?? undefined,
})

export const mapInvoiceTypes = (data: InvoiceTypesDto): InvoiceTypes => {
  const invoiceTypes: InvoiceType[] = data.invoiceTypes.map(mapInvoiceType)

  return {
    totalCount: data.totalCount,
    pageInfo: data.pageInfo,
    data: invoiceTypes.sort((a, b) => a.name.localeCompare(b.name)),
  }
}
