import { InvoiceItemization } from '@island.is/clients/elfur'
import { InvoiceItem } from '../models/invoiceItem.model'
import { mapInvoicePaymentType } from './invoicePaymentTypeMapper'

export const mapInvoiceItem = (item: InvoiceItemization): InvoiceItem => {
  return {
    id: item.id,
    label: item.title,
    invoicePaymentType: mapInvoicePaymentType(item.invoicePaymentType),
    amount: item.amount,
  }
}
