import { InvoiceDto } from '@island.is/clients/government-invoices'
import { Invoice } from '../models/invoice.model'
import { mapInvoiceItem } from './invoiceItemMapper'

export const mapInvoice = (invoice: InvoiceDto): Invoice => {
  return {
    id: invoice.id,
    number: invoice.number,
    totalAmount: invoice.totalAmount,
    itemizations: invoice.itemization.map(mapInvoiceItem),
  }
}
