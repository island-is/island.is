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
import { mapInvoiceGroup } from '../../mappers/invoiceGroupMapper'
import { InvoiceGroup } from '../../models/invoiceGroup.model'
import { InvoiceGroupCollection } from '../../models/invoiceGroups.model'
import { InvoiceGroupsInput } from '../../dtos/getInvoiceGroups.input'

@Injectable()
export class InvoicesService implements IInvoicesService {
  constructor(private elfurService: ElfurClientService) {}

  async getOpenInvoicesGroup(
    input: InvoicesInput,
  ): Promise<InvoiceGroup | null> {
    const data = await this.elfurService.getOpenInvoiceGroup(input)
    if (!data) {
      return null
    }

    return mapInvoiceGroup(data)
  }

  async getOpenInvoiceGroups(
    input?: InvoiceGroupsInput,
  ): Promise<InvoiceGroupCollection | null> {
    // Convert types from number[] to string[] if present
    const requestInput = input
      ? {
          ...input,
          types: input.types?.map(String),
        }
      : undefined

    const data = await this.elfurService.getOpenInvoiceGroups(requestInput)

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
