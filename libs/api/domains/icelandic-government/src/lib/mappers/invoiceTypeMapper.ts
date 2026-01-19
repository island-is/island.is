import { InvoiceTypesDto } from '@island.is/clients/financial-management-authority'
import { InvoiceTypes } from '../models/invoiceTypes.model'
import { InvoiceType } from '../models/invoiceType.model'

export const mapInvoiceTypes = (data: InvoiceTypesDto): InvoiceTypes => {
  const invoiceTypes: InvoiceType[] = data.invoiceTypes.map((invoiceType) => ({
    id: invoiceType.id,
    code: invoiceType.code,
    name: invoiceType.name,
    description: invoiceType.description,
  }))

  return {
    totalCount: data.totalCount,
    pageInfo: data.pageInfo,
    data: invoiceTypes,
  }
}
