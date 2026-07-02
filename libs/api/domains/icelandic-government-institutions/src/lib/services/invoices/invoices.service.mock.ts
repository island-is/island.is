import { Inject, Injectable } from '@nestjs/common'
import { type IInvoicesService } from './invoices.service.interface'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { MOCK_DEBTORS } from '../../mocks/DEBTORS'
import { MOCK_MINISTRIES } from '../../mocks/MINISTRIES'
import { MOCK_SUPPLIERS } from '../../mocks/SUPPLIERS'
import { MOCK_INVOICE_GROUPS } from '../../mocks/INVOICE_GROUPS'
import { MOCK_INVOICE_PAYMENT_TYPES } from '../../mocks/INVOICE_PAYMENT_TYPES'
import { DebtorsInput } from '../../dtos/getDebtors.input'
import { InvoiceGroupInput } from '../../dtos/getInvoiceGroup.input'
import { MinistriesInput } from '../../dtos/getMinistries.input'
import { SuppliersInput } from '../../dtos/getSuppliers.input'
import { Debtors } from '../../models/debtors.model'
import { Ministries } from '../../models/ministries.model'
import { Suppliers } from '../../models/suppliers.model'
import { InvoiceGroupsInput } from '../../dtos/getInvoiceGroups.input'
import { InvoiceGroup } from '../../models/invoiceGroup.model'
import { InvoiceGroupCollection } from '../../models/invoiceGroups.model'
import { InvoicePaymentTypesInput } from '../../dtos/getInvoicePaymentTypes.input'
import { InvoicePaymentTypes } from '../../models/invoicePaymentTypes.model'

@Injectable()
export class MockInvoicesService implements IInvoicesService {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {
    this.logger.info('Using InvoicesServiceMock')
  }

  async getOpenInvoicesGroup(
    _input?: InvoiceGroupInput,
  ): Promise<InvoiceGroup | null> {
    return MOCK_INVOICE_GROUPS.data[0] ?? null
  }

  async getOpenInvoiceGroups(
    _input?: InvoiceGroupsInput,
  ): Promise<InvoiceGroupCollection | null> {
    return MOCK_INVOICE_GROUPS
  }

  async getDebtors(_input?: DebtorsInput): Promise<Debtors | null> {
    return MOCK_DEBTORS
  }

  async getMinistries(_input?: MinistriesInput): Promise<Ministries | null> {
    return MOCK_MINISTRIES
  }

  async getSuppliers(_input?: SuppliersInput): Promise<Suppliers | null> {
    return MOCK_SUPPLIERS
  }

  async getInvoicePaymentTypes(
    _input?: InvoicePaymentTypesInput,
  ): Promise<InvoicePaymentTypes | null> {
    return MOCK_INVOICE_PAYMENT_TYPES
  }
}
