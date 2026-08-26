import { Audit } from '@island.is/nest/audit'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { InvoicesService } from '../services/invoices/invoices.service'
import { InvoicePaymentsGroup } from '../models/invoicePaymentsGroup.model'
import { type InvoicePaymentsGroupWithFilters } from '../types'
import { BypassAuth } from '@island.is/auth-nest-tools'
import { InvoicePaymentsGroupInput } from '../dtos/getInvoicePaymentsGroup.input'

@Resolver(() => InvoicePaymentsGroup)
@Audit({ namespace: '@island.is/api/icelandic-government-institutions' })
export class InvoicePaymentsGroupResolver {
  constructor(private readonly invoiceService: InvoicesService) {}

  @Query(() => InvoicePaymentsGroup, {
    name: 'icelandicGovernmentInstitutionsInvoicePaymentsGroup',
    nullable: true,
  })
  @BypassAuth()
  async getInvoicePaymentsGroup(
    @Args('input', { type: () => InvoicePaymentsGroupInput })
    input: InvoicePaymentsGroupInput,
  ): Promise<InvoicePaymentsGroupWithFilters | null> {
    const group = await this.invoiceService.getOpenInvoicesPaymentsGroup(input)

    if (!group) return null

    return {
      id: `${group.debtor.id}-${group.supplier.id}`,
      supplier: group.supplier,
      debtor: group.debtor,
      totalPaymentsCount: group.totalPaymentsCount,
      totalPaymentsSum: group.totalPaymentsSum,
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
      payments: group.payments,
    }
  }
}
