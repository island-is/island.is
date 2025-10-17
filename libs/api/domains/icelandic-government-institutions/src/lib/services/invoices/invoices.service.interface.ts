import { InvoiceList } from "../../models/invoiceList.model";

export interface IInvoicesService {
  getOpenInvoices(): Promise<InvoiceList | null>
}
