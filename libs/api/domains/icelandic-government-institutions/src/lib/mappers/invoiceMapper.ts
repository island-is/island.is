import { OpenInvoicesDto } from '@island.is/clients/elfur'
import { Invoice } from '../models/invoice.model'

export const mapInvoices = (data: OpenInvoicesDto): Array<Invoice> => {
  if (!data.invoices) {
    return []
  }

  return data.invoices.map((invoice) => {
    return {
      id: `${invoice.customerId}-${invoice.supplierId}`,
      date: invoice.date.toISOString(),
      itemization: [],
      totalItemizationAmount: invoice.amount,
    }
  })
}
