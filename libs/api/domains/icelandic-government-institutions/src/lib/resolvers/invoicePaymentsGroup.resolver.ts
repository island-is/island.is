import { Audit } from '@island.is/nest/audit'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { InvoicesService } from '../services/invoices/invoices.service'
import { InvoicePaymentsGroup } from '../models/invoicePaymentsGroup.model'
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
  ): Promise<InvoicePaymentsGroup | null> {
    return this.invoiceService.getOpenInvoicesPaymentsGroup(input)
  }
}
