import { Audit } from '@island.is/nest/audit'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { type IInvoicesService } from '../services/invoices/invoices.service.interface'
import { Inject } from '@nestjs/common'
import { InvoiceGroup } from '../models/invoiceGroup.model'
import { type InvoiceGroupWithFilters } from '../types'
import { BypassAuth } from '@island.is/auth-nest-tools'
import { InvoiceGroupInput } from '../dtos/getInvoiceGroup.input'

@Resolver(() => InvoiceGroup)
@Audit({ namespace: '@island.is/api/icelandic-government-institutions' })
export class InvoiceGroupResolver {
  constructor(
    @Inject('IInvoicesService')
    private readonly invoiceService: IInvoicesService,
  ) {}

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
      id: `${group.supplier.id}-${group.customer.id}`,
      supplier: group.supplier,
      customer: group.customer,
      totalCount: group.totalCount,
      totalSum: group.totalSum,
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
      types: input.types,
      invoices: group.invoices,
    }
  }
}
