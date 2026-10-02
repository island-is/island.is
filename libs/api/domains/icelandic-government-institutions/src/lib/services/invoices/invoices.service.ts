import { GovernmentInvoicesClientService } from '@island.is/clients/government-invoices'
import { Injectable } from '@nestjs/common'
import { InvoicePaymentsGroupInput } from '../../dtos/getInvoicePaymentsGroup.input'
import { DebtorsInput } from '../../dtos/getDebtors.input'
import { MinistriesInput } from '../../dtos/getMinistries.input'
import { SuppliersInput } from '../../dtos/getSuppliers.input'
import { DebtorCollection } from '../../models/debtors.model'
import { MinistryCollection } from '../../models/ministries.model'
import { SupplierCollection } from '../../models/suppliers.model'
import { mapDebtors } from '../../mappers/debtorMapper'
import { mapMinistries } from '../../mappers/ministryMapper'
import { mapSuppliers } from '../../mappers/supplierMapper'
import { mapInvoicePaymentsGroup } from '../../mappers/invoicePaymentsGroupMapper'
import { InvoicePaymentsGroup } from '../../models/invoicePaymentsGroup.model'
import { InvoicePaymentsGroupCollection } from '../../models/invoicePaymentsGroups.model'
import { InvoicePaymentsGroupsInput } from '../../dtos/getInvoicePaymentsGroups.input'
import { InvoicePaymentTypesInput } from '../../dtos/getInvoicePaymentTypes.input'
import { InvoicePaymentTypeCollection } from '../../models/invoicePaymentTypes.model'
import { mapInvoicePaymentTypes } from '../../mappers/invoicePaymentTypeMapper'
import { InvoicePaymentTypeGroupsInput } from '../../dtos/getInvoicePaymentTypeGroups.input'
import { InvoicePaymentTypeGroupCollection } from '../../models/invoicePaymentTypeGroups.model'
import { mapInvoicePaymentTypeGroups } from '../../mappers/invoicePaymentTypeGroupMapper'

@Injectable()
export class InvoicesService {
  constructor(private govInvoicesService: GovernmentInvoicesClientService) {}

  async getOpenInvoicesPaymentsGroup(
    input: InvoicePaymentsGroupInput,
  ): Promise<InvoicePaymentsGroup | null> {
    const data = await this.govInvoicesService.getOpenInvoicePaymentsGroup(
      input,
    )

    if (!data) {
      return null
    }

    return mapInvoicePaymentsGroup(data, 'detail', input)
  }

  async getOpenInvoicePaymentsGroups(
    input: InvoicePaymentsGroupsInput,
  ): Promise<InvoicePaymentsGroupCollection | null> {
    const data = await this.govInvoicesService.getOpenInvoicePaymentsGroups(
      input,
    )

    if (!data) {
      return null
    }

    return {
      data: data.invoiceGroups.map((group) =>
        mapInvoicePaymentsGroup(group, 'list', input),
      ),
      totalPaymentsCount: data.totalPaymentsCount,
      totalPaymentsSum: data.totalPaymentsSum,
      totalCount: data.totalCount,
      pageInfo: data.pageInfo ?? { hasNextPage: false },
    }
  }

  async getDebtors(input: DebtorsInput): Promise<DebtorCollection | null> {
    const data = await this.govInvoicesService.getDebtors(input)

    if (!data) {
      return null
    }

    return mapDebtors(data)
  }

  async getMinistries(
    input: MinistriesInput,
  ): Promise<MinistryCollection | null> {
    const data = await this.govInvoicesService.getMinistries(input)

    if (!data) {
      return null
    }

    return mapMinistries(data)
  }

  async getInvoicePaymentTypes(
    input: InvoicePaymentTypesInput,
  ): Promise<InvoicePaymentTypeCollection | null> {
    const data = await this.govInvoicesService.getInvoicePaymentTypes(input)

    if (!data) {
      return null
    }

    return mapInvoicePaymentTypes(data)
  }

  async getInvoicePaymentTypeGroups(
    input: InvoicePaymentTypeGroupsInput,
  ): Promise<InvoicePaymentTypeGroupCollection | null> {
    const data = await this.govInvoicesService.getInvoicePaymentTypeGroups(
      input,
    )

    if (!data) {
      return null
    }

    return mapInvoicePaymentTypeGroups(data)
  }

  async getSuppliers(
    input: SuppliersInput,
  ): Promise<SupplierCollection | null> {
    const data = await this.govInvoicesService.getSuppliers(input)

    if (!data) {
      return null
    }

    return mapSuppliers(data)
  }
}
