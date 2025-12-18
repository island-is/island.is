import { CustomersInput } from '../../dtos/getCustomers.input'
import { InvoiceGroupsInput } from '../../dtos/getInvoiceGroups.input'
import { InvoicesInput } from '../../dtos/getInvoices.input'
import { InvoiceTypesInput } from '../../dtos/getInvoiceTypes.input'
import { SuppliersInput } from '../../dtos/getSuppliers.input'
import { Customers } from '../../models/customers.model'
import { InvoiceGroups } from '../../models/invoiceGroups.model'
import { InvoiceGroupWithInvoices } from '../../models/invoiceGroupWithInvoices.model'
import { InvoiceTypes } from '../../models/invoiceTypes.model'
import { Suppliers } from '../../models/suppliers.model'

export interface IInvoicesService {
  getOpenInvoicesGroupWithInvoices(
    input?: InvoicesInput,
  ): Promise<InvoiceGroupWithInvoices | null>
  getOpenInvoiceGroups(
    input?: InvoiceGroupsInput,
  ): Promise<InvoiceGroups | null>
  getSuppliers(input?: SuppliersInput): Promise<Suppliers | null>
  getCustomers(input?: CustomersInput): Promise<Customers | null>
  getInvoiceTypes(input?: InvoiceTypesInput): Promise<InvoiceTypes | null>
}
