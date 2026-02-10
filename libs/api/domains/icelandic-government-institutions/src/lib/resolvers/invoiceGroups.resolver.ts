import { Audit } from '@island.is/nest/audit'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { BypassAuth } from '@island.is/auth-nest-tools'
import { type IInvoicesService } from '../services/invoices/invoices.service.interface'
import { Inject } from '@nestjs/common'
import { InvoicesFilters } from '../models/invoicesFilters'
import { InvoiceGroupsInput } from '../dtos/getInvoiceGroups.input'
import type { InvoiceGroupsWithFilters } from '../types'
import { InvoiceGroupCollection } from '../models/invoiceGroups.model'

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
      types: input.types,
    }
  }

  @Query(() => InvoicesFilters, {
    name: 'icelandicGovernmentInstitutionsInvoicesFilters',
    nullable: true,
  })
  @BypassAuth()
  async getInvoicesFilters(): Promise<InvoicesFilters | null> {
    const [customers, suppliers, invoicePaymentTypes] = await Promise.all([
      this.invoiceService.getCustomers({ limit: 1000 }),
      this.invoiceService.getSuppliers({ limit: 1000 }),
      this.invoiceService.getInvoicePaymentTypes({ limit: 1000 }),
    ])

    return {
      customers: customers ?? undefined,
      suppliers: suppliers ?? undefined,
      invoicePaymentTypes: invoicePaymentTypes ?? undefined,
    }
  }
}
