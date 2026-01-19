import { Audit } from '@island.is/nest/audit'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { type IInvoicesService } from '../services/invoices/invoices.service.interface'
import { Inject } from '@nestjs/common'
import { InvoiceGroup } from '../models/invoiceGroup.model'
import { BypassAuth } from '@island.is/auth-nest-tools'
import { InvoiceGroupInput } from '../dtos/getInvoiceGroup.input'
import { InvoiceGroupWithInvoices } from '../models/invoiceGroupWithInvoices.model'
import { InvoiceGroupsWithFilters, InvoiceGroupWithFilters } from '../types'
import { InvoiceGroupsInput } from '../dtos/getInvoiceGroups.input'
import { InvoiceGroups } from '../models/invoiceGroups.model'
import { InvoicesFilters } from '../models/invoicesFilters'

@Resolver(() => InvoiceGroup)
@Audit({ namespace: '@island.is/api/icelandic-government' })
export class InvoiceGroupResolver {
  constructor(
    @Inject('IInvoicesService')
    private readonly invoiceService: IInvoicesService,
  ) {}

  @Query(() => InvoiceGroupWithInvoices, {
    name: 'icelandicGovernmentInvoiceGroup',
    nullable: true,
  })
  @BypassAuth()
  async getInvoiceGroup(
    @Args('input', { type: () => InvoiceGroupInput })
    input: InvoiceGroupInput,
  ): Promise<InvoiceGroupWithFilters | null> {
    const group = await this.invoiceService.getOpenInvoicesGroupWithInvoices(
      input,
    )

    if (!group) return null

    return {
      id: `${group.supplier.id}-${group.customer.id}`,
      supplier: group.supplier,
      customer: group.customer,
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
      types: input.types,
      invoices: group.invoices,
    }
  }

  @Query(() => InvoiceGroups, {
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
      types: input.types,
    }
  }

  @Query(() => InvoicesFilters, {
    name: 'icelandicGovernmentInstitutionsInvoicesFilters',
    nullable: true,
  })
  @BypassAuth()
  async getInvoicesFilters(): Promise<InvoicesFilters | null> {
    const [customers, suppliers, invoiceTypes] = await Promise.all([
      this.invoiceService.getCustomers({ limit: 1000 }),
      this.invoiceService.getSuppliers({ limit: 1000 }),
      this.invoiceService.getInvoiceTypes({ limit: 1000 }),
    ])

    return {
      customers: customers ?? undefined,
      suppliers: suppliers ?? undefined,
      invoiceTypes: invoiceTypes ?? undefined,
    }
  }
}
