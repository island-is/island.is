import { Audit } from '@island.is/nest/audit'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { BypassAuth } from '@island.is/auth-nest-tools'
import { InvoicesService } from '../services/invoices/invoices.service'
import { InvoicePaymentsGroupsInput } from '../dtos/getInvoicePaymentsGroups.input'
import { InvoicePaymentsGroupCollection } from '../models/invoicePaymentsGroups.model'
import { MinistryCollection } from '../models/ministries.model'
import { MinistriesInput } from '../dtos/getMinistries.input'
import { SupplierCollection } from '../models/suppliers.model'
import { SuppliersInput } from '../dtos/getSuppliers.input'
import { DebtorCollection } from '../models/debtors.model'
import { DebtorsInput } from '../dtos/getDebtors.input'
import { InvoicePaymentTypeCollection } from '../models/invoicePaymentTypes.model'
import { InvoicePaymentTypesInput } from '../dtos/getInvoicePaymentTypes.input'
import { InvoicePaymentTypeGroupCollection } from '../models/invoicePaymentTypeGroups.model'
import { InvoicePaymentTypeGroupsInput } from '../dtos/getInvoicePaymentTypeGroups.input'

@Resolver(() => InvoicePaymentsGroupCollection)
@Audit({ namespace: '@island.is/api/icelandic-government-institutions' })
@CodeOwner(CodeOwners.Hugsmidjan)
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
  ): Promise<InvoicePaymentsGroupCollection | null> {
    return this.invoiceService.getOpenInvoicePaymentsGroups(input)
  }

  @Query(() => MinistryCollection, {
    name: 'icelandicGovernmentInstitutionsMinistries',
    nullable: true,
  })
  @BypassAuth()
  async getMinistriesList(
    @Args('input', { type: () => MinistriesInput })
    input: MinistriesInput,
  ): Promise<MinistryCollection | null> {
    return this.invoiceService.getMinistries(input)
  }

  @Query(() => SupplierCollection, {
    name: 'icelandicGovernmentInstitutionsSuppliers',
    nullable: true,
  })
  @BypassAuth()
  async getSuppliersList(
    @Args('input', { type: () => SuppliersInput })
    input: SuppliersInput,
  ): Promise<SupplierCollection | null> {
    return this.invoiceService.getSuppliers(input)
  }

  @Query(() => DebtorCollection, {
    name: 'icelandicGovernmentInstitutionsDebtors',
    nullable: true,
  })
  @BypassAuth()
  async getDebtorsList(
    @Args('input', { type: () => DebtorsInput })
    input: DebtorsInput,
  ): Promise<DebtorCollection | null> {
    return this.invoiceService.getDebtors(input)
  }

  @Query(() => InvoicePaymentTypeCollection, {
    name: 'icelandicGovernmentInstitutionsInvoicePaymentTypes',
    nullable: true,
  })
  @BypassAuth()
  async getInvoicePaymentTypesList(
    @Args('input', { type: () => InvoicePaymentTypesInput })
    input: InvoicePaymentTypesInput,
  ): Promise<InvoicePaymentTypeCollection | null> {
    return this.invoiceService.getInvoicePaymentTypes(input)
  }

  @Query(() => InvoicePaymentTypeGroupCollection, {
    name: 'icelandicGovernmentInstitutionsInvoicePaymentTypeGroups',
    nullable: true,
  })
  @BypassAuth()
  async getInvoicePaymentTypeGroupsList(
    @Args('input', { type: () => InvoicePaymentTypeGroupsInput })
    input: InvoicePaymentTypeGroupsInput,
  ): Promise<InvoicePaymentTypeGroupCollection | null> {
    return this.invoiceService.getInvoicePaymentTypeGroups(input)
  }
}
