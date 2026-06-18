import { GovernmentInvoicesClientService } from '@island.is/clients/government-invoices'
import { Injectable } from '@nestjs/common'
import { type IInvoicesService } from './invoices.service.interface'
import { InvoicesInput } from '../../dtos/getInvoices.input'
import { DebtorsInput } from '../../dtos/getDebtors.input'
import { MinistriesInput } from '../../dtos/getMinistries.input'
import { SuppliersInput } from '../../dtos/getSuppliers.input'
import { Debtors } from '../../models/debtors.model'
import { Ministries } from '../../models/ministries.model'
import { Suppliers } from '../../models/suppliers.model'
import { mapDebtors } from '../../mappers/debtorMapper'
import { mapMinistries } from '../../mappers/ministryMapper'
import { mapSuppliers } from '../../mappers/supplierMapper'
import { mapInvoiceGroup } from '../../mappers/invoiceGroupMapper'
import { InvoiceGroup } from '../../models/invoiceGroup.model'
import { InvoiceGroupCollection } from '../../models/invoiceGroups.model'
import { InvoiceGroupsInput } from '../../dtos/getInvoiceGroups.input'
import { InvoicePaymentTypesInput } from '../../dtos/getInvoicePaymentTypes.input'
import { InvoicePaymentTypes } from '../../models/invoicePaymentTypes.model'
import { mapInvoicePaymentTypes } from '../../mappers/invoicePaymentTypeMapper'

@Injectable()
export class InvoicesService implements IInvoicesService {
  constructor(private govInvoicesService: GovernmentInvoicesClientService) {}

  async getOpenInvoicesGroup(
    input: InvoicesInput,
  ): Promise<InvoiceGroup | null> {
    const data = await this.govInvoicesService.getOpenInvoiceGroup(input)

    if (!data) {
      return null
    }

    return mapInvoiceGroup(data)
  }

  async getOpenInvoiceGroups(
    input?: InvoiceGroupsInput,
  ): Promise<InvoiceGroupCollection | null> {
    const data = await this.govInvoicesService.getOpenInvoiceGroups(input)

    if (!data) {
      return null
    }

    return {
      data: data.invoiceGroups.map((group) => mapInvoiceGroup(group)),
      totalPaymentsCount: data.totalPaymentsCount,
      totalPaymentsSum: data.totalPaymentsSum,
      totalCount: data.totalCount,
      pageInfo: data.pageInfo ?? { hasNextPage: false },
    }
  }

  async getDebtors(input?: DebtorsInput): Promise<Debtors | null> {
    const data = await this.govInvoicesService.getDebtors(input)

    if (!data) {
      return null
    }

    return mapDebtors(data)
  }

  async getMinistries(input?: MinistriesInput): Promise<Ministries | null> {
    const data = await this.govInvoicesService.getMinistries(input)

    if (!data) {
      return null
    }

    return mapMinistries(data)
  }

  async getInvoicePaymentTypes(
    input?: InvoicePaymentTypesInput,
  ): Promise<InvoicePaymentTypes | null> {
    const data = await this.govInvoicesService.getInvoicePaymentTypes(input)

    if (!data) {
      return null
    }

    return mapInvoicePaymentTypes(data)
  }

  async getSuppliers(input?: SuppliersInput): Promise<Suppliers | null> {
    const data = await this.govInvoicesService.getSuppliers(input)

    if (!data) {
      return null
    }

    return mapSuppliers(data)
  }
}
