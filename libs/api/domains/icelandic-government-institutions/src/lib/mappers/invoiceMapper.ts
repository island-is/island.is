import { InvoiceGroupInvoiceDto } from '@island.is/clients/elfur'
import { Invoice } from '../models/invoice.model'
import { mapInvoiceItem } from './invoiceItemMapper'

export const mapInvoice = (invoice: InvoiceGroupInvoiceDto): Invoice => {
  return {
    id: invoice.id,
    date: invoice.timestamp.toISOString(),
    totalItemizationAmount: invoice.amount,
    itemizations: invoice.itemization.map(mapInvoiceItem),
  }
}
