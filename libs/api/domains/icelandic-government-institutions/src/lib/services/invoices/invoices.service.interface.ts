import { InvoiceListInput } from '../../dtos/getInvoiceList.input'
import { InvoiceList } from '../../models/invoiceList.model'

export interface IInvoicesService {
  getOpenInvoices(input: InvoiceListInput): Promise<InvoiceList | null>
}
