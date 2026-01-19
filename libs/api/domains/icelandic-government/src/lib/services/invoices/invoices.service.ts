import { Injectable } from '@nestjs/common'
import { type IInvoicesService } from './invoices.service.interface'
import { InvoicesInput } from '../../dtos/getInvoices.input'
import { CustomersInput } from '../../dtos/getCustomers.input'
import { InvoiceTypesInput } from '../../dtos/getInvoiceTypes.input'
import { SuppliersInput } from '../../dtos/getSuppliers.input'
import { Customers } from '../../models/customers.model'
import { InvoiceTypes } from '../../models/invoiceTypes.model'
import { Suppliers } from '../../models/suppliers.model'
import { mapCustomers } from '../../mappers/customerMapper'
import { mapInvoiceTypes } from '../../mappers/invoiceTypeMapper'
import { mapSuppliers } from '../../mappers/supplierMapper'
import { InvoiceGroups } from '../../models/invoiceGroups.model'
import { mapInvoiceGroup } from '../../mappers/invoiceGroupMapper'
import { InvoiceGroupsInput } from '../../dtos/getInvoiceGroups.input'
import { InvoiceGroupWithInvoices } from '../../models/invoiceGroupWithInvoices.model'
import { FinancialManagementAuthorityClientOpenInvoicesService } from '@island.is/clients/financial-management-authority'
import { mapInvoiceGroupWithInvoices } from '../../mappers/invoiceGroupWithInvoices'

@Injectable()
export class InvoicesService implements IInvoicesService {
  constructor(
    private service: FinancialManagementAuthorityClientOpenInvoicesService,
  ) {}

  async getOpenInvoicesGroupWithInvoices(
    input: InvoicesInput,
  ): Promise<InvoiceGroupWithInvoices | null> {
    const data = await this.service.getOpenInvoicesGroupWithInvoices(input)
    if (!data) {
      return null
    }

    return mapInvoiceGroupWithInvoices(data)
  }

  async getOpenInvoiceGroups(
    input?: InvoiceGroupsInput,
  ): Promise<InvoiceGroups | null> {
    const data = await this.service.getOpenInvoicesGroups(input)

    if (!data) {
      return null
    }

    return {
      data: data.invoiceGroups.map((group) => mapInvoiceGroup(group)),
      totalPaymentsCount: data.totalPaymentsCount,
      totalPaymentsSum: data.totalPaymentsSum,
      totalCount: data.totalCount,
      //temp page info
      pageInfo: {
        hasNextPage: false,
      },
    }
  }

  async getCustomers(input?: CustomersInput): Promise<Customers | null> {
    const data = await this.service.getCustomers(input)

    if (!data) {
      return null
    }

    return mapCustomers(data)
  }

  async getInvoiceTypes(
    input?: InvoiceTypesInput,
  ): Promise<InvoiceTypes | null> {
    const data = await this.service.getInvoiceTypes(input)

    if (!data) {
      return null
    }

    return mapInvoiceTypes(data)
  }

  async getSuppliers(input?: SuppliersInput): Promise<Suppliers | null> {
    const data = await this.service.getSuppliers(input)

    if (!data) {
      return null
    }

    return mapSuppliers(data)
  }
}
