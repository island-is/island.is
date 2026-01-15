import { CustomersInput } from '../../dtos/getCustomers.input'
import { InvoicesInput } from '../../dtos/getInvoices.input'
import { InvoiceTypesInput } from '../../dtos/getInvoiceTypes.input'
import { SuppliersInput } from '../../dtos/getSuppliers.input'
import { Customers } from '../../models/customers.model'
import { Invoices } from '../../models/invoices.model'
import { InvoiceTypes } from '../../models/invoiceTypes.model'
import { Suppliers } from '../../models/suppliers.model'

export interface IInvoicesService {
  getOpenInvoices(input?: InvoicesInput): Promise<Invoices | null>
  getSuppliers(input?: SuppliersInput): Promise<Suppliers | null>
  getCustomers(input?: CustomersInput): Promise<Customers | null>
  getInvoiceTypes(input?: InvoiceTypesInput): Promise<InvoiceTypes | null>
}
