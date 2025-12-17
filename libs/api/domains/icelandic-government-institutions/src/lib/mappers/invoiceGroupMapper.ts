import { InvoiceGroupDto } from '@island.is/clients/elfur'
import { InvoiceGroup } from '../models/invoiceGroup.model'

export const mapInvoiceGroup = (data: InvoiceGroupDto): InvoiceGroup => {
  return {
    id: `${data.customer.id}-${data.supplier.id}`,
    supplier: data.supplier,
    customer: data.customer,
    totalPaymentsSum: data.paymentsSum,
    totalPaymentsCount: data.paymentsCount,
    //don't map invoices, they're field resolved
  }
}
