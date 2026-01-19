import { InvoiceGroupWithInvoicesDto } from '@island.is/clients/financial-management-authority'
import { InvoiceGroupWithInvoices } from '../models/invoiceGroupWithInvoices.model'

export const mapInvoiceGroupWithInvoices = (
  data: InvoiceGroupWithInvoicesDto,
): InvoiceGroupWithInvoices => {
  return {
    id: `${data.customer.id}-${data.supplier.id}`,
    supplier: data.supplier,
    customer: data.customer,
    invoices:
      data.invoices?.map((invoice) => ({
        id: invoice.id,
        date: invoice.timestamp.toISOString(),
        totalItemizationAmount: invoice.amount,
        itemization: invoice.itemization.map((item) => ({
          id: item.id,
          label: item.title,
          amount: item.amount,
        })),
      })) ?? [],
  }
}
