import { Audit } from '@island.is/nest/audit'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { BypassAuth } from '@island.is/auth-nest-tools'
import { InvoicesService } from '../services/invoices/invoices.service'
import { InvoicePaymentsGroupsInput } from '../dtos/getInvoicePaymentsGroups.input'
import type { InvoicePaymentsGroupsWithFilters } from '../types'
import { InvoicePaymentsGroupCollection } from '../models/invoicePaymentsGroups.model'
import { Ministries } from '../models/ministries.model'
import { MinistriesInput } from '../dtos/getMinistries.input'
import { Suppliers } from '../models/suppliers.model'
import { SuppliersInput } from '../dtos/getSuppliers.input'
import { Debtors } from '../models/debtors.model'
import { DebtorsInput } from '../dtos/getDebtors.input'
import { InvoicePaymentTypes } from '../models/invoicePaymentTypes.model'
import { InvoicePaymentTypesInput } from '../dtos/getInvoicePaymentTypes.input'

@Resolver(() => InvoicePaymentsGroupCollection)
@Audit({ namespace: '@island.is/api/icelandic-government-institutions' })
export class InvoicePaymentsGroupsResolver {
  constructor(private readonly invoiceService: InvoicesService) {}

  @Query(() => InvoicePaymentsGroupCollection, {
    name: 'icelandicGovernmentInstitutionsInvoicePaymentsGroups',
    nullable: true,
  })
  @BypassAuth()
  async getInvoicePaymentsGroups(
    @Args('input', { type: () => InvoicePaymentsGroupsInput })
    input: InvoicePaymentsGroupsInput,
  ): Promise<InvoicePaymentsGroupsWithFilters | null> {
    const groups = await this.invoiceService.getOpenInvoicePaymentsGroups(input)
    if (!groups) return null

    return {
      ...groups,
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
    }
  }

  @Query(() => Ministries, {
    name: 'icelandicGovernmentInstitutionsMinistries',
    nullable: true,
  })
  @BypassAuth()
  async getMinistriesList(
    @Args('input', { type: () => MinistriesInput })
    input: MinistriesInput,
  ): Promise<Ministries | null> {
    return this.invoiceService.getMinistries(input)
  }

  @Query(() => Suppliers, {
    name: 'icelandicGovernmentInstitutionsSuppliers',
    nullable: true,
  })
  @BypassAuth()
  async getSuppliersList(
    @Args('input', { type: () => SuppliersInput })
    input: SuppliersInput,
  ): Promise<Suppliers | null> {
    return this.invoiceService.getSuppliers(input)
  }

  @Query(() => Debtors, {
    name: 'icelandicGovernmentInstitutionsDebtors',
    nullable: true,
  })
  @BypassAuth()
  async getDebtorsList(
    @Args('input', { type: () => DebtorsInput })
    input: DebtorsInput,
  ): Promise<Debtors | null> {
    return this.invoiceService.getDebtors(input)
  }

  @Query(() => InvoicePaymentTypes, {
    name: 'icelandicGovernmentInstitutionsInvoicePaymentTypes',
    nullable: true,
  })
  @BypassAuth()
  async getInvoicePaymentTypesList(
    @Args('input', { type: () => InvoicePaymentTypesInput })
    input: InvoicePaymentTypesInput,
  ): Promise<InvoicePaymentTypes | null> {
    return this.invoiceService.getInvoicePaymentTypes(input)
  }
}
