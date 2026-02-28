import { InvoiceGroupDto } from '@island.is/clients/elfur'
import { InvoiceGroup } from '../models/invoiceGroup.model'
import { mapInvoice } from './invoiceMapper'
import { isDefined } from '@island.is/shared/utils'

export const mapInvoiceGroup = (data: InvoiceGroupDto): InvoiceGroup => {
  return {
    id: `${data.customer.id}-${data.supplier.id}`,
    supplier: data.supplier,
    customer: data.customer,
    totalSum: data.paymentsSum,
    totalCount: data.paymentsCount,
    invoices: data.invoices?.map(mapInvoice).filter(isDefined),
  }
}
