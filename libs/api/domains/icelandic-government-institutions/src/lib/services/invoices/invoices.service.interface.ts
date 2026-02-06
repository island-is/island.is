import { CustomersInput } from '../../dtos/getCustomers.input'
import { InvoiceGroupsInput } from '../../dtos/getInvoiceGroups.input'
import { InvoicesInput } from '../../dtos/getInvoices.input'
import { InvoiceTypesInput } from '../../dtos/getInvoiceTypes.input'
import { SuppliersInput } from '../../dtos/getSuppliers.input'
import { Customers } from '../../models/customers.model'
import { InvoiceGroup } from '../../models/invoiceGroup.model'
import { InvoiceGroupCollection } from '../../models/invoiceGroups.model'
import { InvoiceTypes } from '../../models/invoiceTypes.model'
import { Suppliers } from '../../models/suppliers.model'

export interface IInvoicesService {
  getOpenInvoicesGroup(input?: InvoicesInput): Promise<InvoiceGroup | null>
  getOpenInvoiceGroups(
    input?: InvoiceGroupsInput,
  ): Promise<InvoiceGroupCollection | null>
  getSuppliers(input?: SuppliersInput): Promise<Suppliers | null>
  getCustomers(input?: CustomersInput): Promise<Customers | null>
  getInvoiceTypes(input?: InvoiceTypesInput): Promise<InvoiceTypes | null>
}
