import { Inject, Injectable } from '@nestjs/common'
import { type IInvoicesService } from './invoices.service.interface'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { MOCK_INVOICES } from '../../mocks/INVOICES'
import { MOCK_CUSTOMERS } from '../../mocks/CUSTOMERS'
import { MOCK_INVOICE_TYPES } from '../../mocks/INVOICE_TYPES'
import { CustomersInput } from '../../dtos/getCustomers.input'
import { InvoicesInput } from '../../dtos/getInvoices.input'
import { InvoiceTypesInput } from '../../dtos/getInvoiceTypes.input'
import { SuppliersInput } from '../../dtos/getSuppliers.input'
import { Customers } from '../../models/customers.model'
import { Invoices } from '../../models/invoices.model'
import { InvoiceTypes } from '../../models/invoiceTypes.model'
import { Suppliers } from '../../models/suppliers.model'

@Injectable()
export class MockInvoicesService implements IInvoicesService {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {
    this.logger.info('Using InvoicesServiceMock')
  }
  async getOpenInvoices(_input: InvoicesInput): Promise<Invoices | null> {
    return MOCK_INVOICES
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
    return MOCK_CUSTOMERS
  }
}
