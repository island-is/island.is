import { Inject, Injectable } from '@nestjs/common'
import { type IInvoicesService } from './invoices.service.interface'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { MOCK_CUSTOMERS } from '../../mocks/CUSTOMERS'
import { MOCK_INVOICE_TYPES } from '../../mocks/INVOICE_TYPES'
import { MOCK_SUPPLIERS } from '../../mocks/SUPPLIERS'
import { MOCK_INVOICE_GROUPS } from '../../mocks/INVOICE_GROUPS'
import { CustomersInput } from '../../dtos/getCustomers.input'
import { InvoicesInput } from '../../dtos/getInvoices.input'
import { InvoiceTypesInput } from '../../dtos/getInvoiceTypes.input'
import { SuppliersInput } from '../../dtos/getSuppliers.input'
import { Customers } from '../../models/customers.model'
import { InvoiceTypes } from '../../models/invoiceTypes.model'
import { Suppliers } from '../../models/suppliers.model'
import { InvoiceGroupsInput } from '../../dtos/getInvoiceGroups.input'
import { InvoiceGroup } from '../../models/invoiceGroup.model'
import { InvoiceGroupCollection } from '../../models/invoiceGroups.model'

@Injectable()
export class MockInvoicesService implements IInvoicesService {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {
    this.logger.info('Using InvoicesServiceMock')
  }
  async getOpenInvoicesGroup(
    _input?: InvoicesInput,
  ): Promise<InvoiceGroup | null> {
    // Return the first invoice group from the collection as a single group
    return MOCK_INVOICE_GROUPS.data[0] ?? null
  }
  async getOpenInvoiceGroups(
    _input?: InvoiceGroupsInput,
  ): Promise<InvoiceGroupCollection | null> {
    return MOCK_INVOICE_GROUPS
  }

  async getCustomers(_input: CustomersInput): Promise<Customers | null> {
    return MOCK_CUSTOMERS
  }

  async getInvoiceTypes(
    _input: InvoiceTypesInput,
  ): Promise<InvoiceTypes | null> {
    return MOCK_INVOICE_TYPES
  }

  async getSuppliers(_input: SuppliersInput): Promise<Suppliers | null> {
    return MOCK_SUPPLIERS
  }
}
