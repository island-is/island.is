import { Inject, Injectable } from '@nestjs/common'
import { type IInvoicesService } from './invoices.service.interface'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { MOCK_CUSTOMERS } from '../../mocks/CUSTOMERS'
import { MOCK_INVOICE_TYPES } from '../../mocks/INVOICE_TYPES'
import { MOCK_SUPPLIERS } from '../../mocks/SUPPLIERS'
import { MOCK_INVOICE_GROUPS } from '../../mocks/INVOICE_GROUPS'
import { MOCK_INVOICE_GROUP_WITH_INVOICES } from '../../mocks/INVOICE_GROUP_WITH_INVOICES'
import { CustomersInput } from '../../dtos/getCustomers.input'
import { InvoicesInput } from '../../dtos/getInvoices.input'
import { InvoiceTypesInput } from '../../dtos/getInvoiceTypes.input'
import { SuppliersInput } from '../../dtos/getSuppliers.input'
import { Customers } from '../../models/customers.model'
import { InvoiceTypes } from '../../models/invoiceTypes.model'
import { Suppliers } from '../../models/suppliers.model'
import { InvoiceGroupsInput } from '../../dtos/getInvoiceGroups.input'
import { InvoiceGroups } from '../../models/invoiceGroups.model'
import { InvoiceGroupWithInvoices } from '../../models/invoiceGroupWithInvoices.model'

@Injectable()
export class MockInvoicesService implements IInvoicesService {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {
    this.logger.info('Using InvoicesServiceMock')
  }
  async getOpenInvoicesGroupWithInvoices(
    _input?: InvoicesInput,
  ): Promise<InvoiceGroupWithInvoices | null> {
    // Return the mock invoice group with its invoices
    return MOCK_INVOICE_GROUP_WITH_INVOICES
  }
  async getOpenInvoiceGroups(
    _input?: InvoiceGroupsInput,
  ): Promise<InvoiceGroups | null> {
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
