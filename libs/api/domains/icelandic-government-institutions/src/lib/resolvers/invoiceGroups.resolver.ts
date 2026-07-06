import { Audit } from '@island.is/nest/audit'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { BypassAuth } from '@island.is/auth-nest-tools'
import { type IInvoicesService } from '../services/invoices/invoices.service.interface'
import { Inject } from '@nestjs/common'
import { InvoiceGroupsInput } from '../dtos/getInvoiceGroups.input'
import type { InvoiceGroupsWithFilters } from '../types'
import { InvoiceGroupCollection } from '../models/invoiceGroups.model'
import { Ministries } from '../models/ministries.model'
import { MinistriesInput } from '../dtos/getMinistries.input'
import { Suppliers } from '../models/suppliers.model'
import { SuppliersInput } from '../dtos/getSuppliers.input'
import { Debtors } from '../models/debtors.model'
import { DebtorsInput } from '../dtos/getDebtors.input'
import { InvoicePaymentTypes } from '../models/invoicePaymentTypes.model'
import { InvoicePaymentTypesInput } from '../dtos/getInvoicePaymentTypes.input'

@Resolver(() => InvoiceGroupCollection)
@Audit({ namespace: '@island.is/api/icelandic-government-institutions' })
export class InvoiceGroupsResolver {
  constructor(
    @Inject('IInvoicesService')
    private readonly invoiceService: IInvoicesService,
  ) {}

  @Query(() => InvoiceGroupCollection, {
    name: 'icelandicGovernmentInstitutionsInvoiceGroups',
    nullable: true,
  })
  @BypassAuth()
  async getInvoiceGroups(
    @Args('input', { type: () => InvoiceGroupsInput })
    input: InvoiceGroupsInput,
  ): Promise<InvoiceGroupsWithFilters | null> {
    const groups = await this.invoiceService.getOpenInvoiceGroups(input)
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
