import { ElfurClientService } from '@island.is/clients/elfur'
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
import { Invoice } from '../../models/invoice.model'
import { InvoiceGroupsInput } from '../../dtos/getInvoiceGroups.input'
import { mapInvoices } from '../../mappers/invoiceMapper'

@Injectable()
export class InvoicesService implements IInvoicesService {
  constructor(private elfurService: ElfurClientService) {}

  async getOpenInvoicesByGroup(
    input: InvoicesInput,
  ): Promise<Invoice[] | null> {
    const data = await this.elfurService.getOpenInvoicesByGroup(input)

    if (!data) {
      return null
    }

    return mapInvoices(data)
  }

  async getOpenInvoiceGroups(
    input?: InvoiceGroupsInput,
  ): Promise<InvoiceGroups | null> {
    const data = await this.elfurService.getOpenInvoicesGroups(input)

    if (!data) {
      return null
    }

    const groups = data.map((group) => mapInvoiceGroup(group))

    return {
      data: groups,
      //temp total count
      totalCount: groups.length,
      //temp page info
      pageInfo: {
        hasNextPage: false,
      },
    }
  }

  async getCustomers(input?: CustomersInput): Promise<Customers | null> {
    const data = await this.elfurService.getCustomers(input)

    if (!data) {
      return null
    }

    return mapCustomers(data)
  }

  async getInvoiceTypes(
    input?: InvoiceTypesInput,
  ): Promise<InvoiceTypes | null> {
    const data = await this.elfurService.getInvoiceTypes(input)

    if (!data) {
      return null
    }

    return mapInvoiceTypes(data)
  }

  async getSuppliers(input?: SuppliersInput): Promise<Suppliers | null> {
    const data = await this.elfurService.getSuppliers(input)

    if (!data) {
      return null
    }

    return mapSuppliers(data)
  }
}
