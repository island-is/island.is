import { Audit } from '@island.is/nest/audit'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { InvoicesService } from '../services/invoices/invoices.service'
import { InvoiceGroup } from '../models/invoiceGroup.model'
import { type InvoiceGroupWithFilters } from '../types'
import { BypassAuth } from '@island.is/auth-nest-tools'
import { InvoiceGroupInput } from '../dtos/getInvoiceGroup.input'

@Resolver(() => InvoiceGroup)
@Audit({ namespace: '@island.is/api/icelandic-government-institutions' })
export class InvoiceGroupResolver {
  constructor(private readonly invoiceService: InvoicesService) {}

  @Query(() => InvoiceGroup, {
    name: 'icelandicGovernmentInstitutionsInvoiceGroup',
    nullable: true,
  })
  @BypassAuth()
  async getInvoiceGroup(
    @Args('input', { type: () => InvoiceGroupInput })
    input: InvoiceGroupInput,
  ): Promise<InvoiceGroupWithFilters | null> {
    const group = await this.invoiceService.getOpenInvoicesGroup(input)

    if (!group) return null

    return {
      id: `${group.debtor.id}-${group.supplier.id}`,
      supplier: group.supplier,
      debtor: group.debtor,
      totalCount: group.totalCount,
      totalSum: group.totalSum,
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
      invoices: group.invoices,
    }
  }
}
