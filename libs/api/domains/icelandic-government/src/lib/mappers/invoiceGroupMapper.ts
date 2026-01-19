import { InvoiceGroup } from '../models/invoiceGroup.model'
import { InvoiceGroupDto } from '@island.is/clients/financial-management-authority'

export const mapInvoiceGroup = (data: InvoiceGroupDto): InvoiceGroup => {
  return {
    id: `${data.customer.id}-${data.supplier.id}`,
    supplier: data.supplier,
    customer: data.customer,
    totalPaymentsSum: data.paymentsSum,
    totalPaymentsCount: data.paymentsCount,
  }
}
