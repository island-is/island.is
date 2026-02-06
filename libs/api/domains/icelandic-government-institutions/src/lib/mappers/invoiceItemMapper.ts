import { InvoiceItemization } from '@island.is/clients/elfur'
import { mapInvoiceType } from './invoiceTypeMapper'
import { InvoiceItem } from '../models/invoiceItem.model'

export const mapInvoiceItem = (item: InvoiceItemization): InvoiceItem => {
  return {
    id: item.id,
    label: item.title,
    invoiceType: mapInvoiceType(item.invoiceType),
    amount: item.amount,
  }
}
