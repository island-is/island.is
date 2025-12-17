import { Audit } from '@island.is/nest/audit'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { BypassAuth } from '@island.is/auth-nest-tools'
import { type IInvoicesService } from '../services/invoices/invoices.service.interface'
import { Inject } from '@nestjs/common'
import { InvoicesFilters } from '../models/invoicesFilters'
import { InvoiceGroups } from '../models/invoiceGroups.model'
import { InvoiceGroupsInput } from '../dtos/getInvoiceGroups.input'
import type {
  InvoiceGroupsWithFilters,
  InvoiceGroupWithFilters,
} from '../types'
import { InvoiceGroup } from '../models/invoiceGroup.model'

@Resolver(() => InvoiceGroups)
@Audit({ namespace: '@island.is/api/icelandic-government-institutions' })
export class InvoiceGroupsResolver {
  constructor(
    @Inject('IInvoicesService')
    private readonly invoiceService: IInvoicesService,
  ) {}

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

  @ResolveField('data', () => [InvoiceGroup])
  resolveInvoiceGroup(
    @Parent() invoiceGroup: InvoiceGroupsWithFilters,
  ): Promise<InvoiceGroupWithFilters[]> {
    return Promise.resolve(
      invoiceGroup.data.map((group) => ({
        ...group,
        dateFrom: invoiceGroup.dateFrom,
        dateTo: invoiceGroup.dateTo,
        types: invoiceGroup.types,
      })),
    )
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
