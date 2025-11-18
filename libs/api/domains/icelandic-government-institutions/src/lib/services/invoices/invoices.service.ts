import { ElfurClientService } from '@island.is/clients/elfur'
import { Injectable } from '@nestjs/common'
import { type IInvoicesService } from './invoices.service.interface'
import { Invoices } from '../../models/invoices.model'
import { InvoicesInput } from '../../dtos/getInvoices.input'
import { CustomersInput } from '../../dtos/getCustomers.input'
import { InvoiceTypesInput } from '../../dtos/getInvoiceTypes.input'
import { SuppliersInput } from '../../dtos/getSuppliers.input'
import { Customers } from '../../models/customers.model'
import { InvoiceTypes } from '../../models/invoiceTypes.model'
import { Suppliers } from '../../models/suppliers.model'
import { mapInvoices } from '../../mappers/invoiceMapper'
import { mapCustomers } from '../../mappers/customerMapper'
import { mapInvoiceTypes } from '../../mappers/invoiceTypeMapper'
import { mapSuppliers } from '../../mappers/supplierMapper'

@Injectable()
export class InvoicesService implements IInvoicesService {
  constructor(private elfurService: ElfurClientService) {}

  async getOpenInvoices(input?: InvoicesInput): Promise<Invoices | null> {
    const data = await this.elfurService.getOpenInvoices(input)

    if (!data) {
      return null
    }

    return mapInvoices(data)
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
