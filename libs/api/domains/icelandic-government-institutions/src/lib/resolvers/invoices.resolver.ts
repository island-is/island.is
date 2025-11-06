import { Audit } from '@island.is/nest/audit'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { BypassAuth } from '@island.is/auth-nest-tools'
import { type IInvoicesService } from '../services/invoices/invoices.service.interface'
import { InvoiceList } from '../models/invoiceList.model'
import { Inject } from '@nestjs/common'
import { InvoiceListInput } from '../dtos/getInvoiceList.input'

@Resolver()
@Audit({ namespace: '@island.is/api/icelandic-government-institutions' })
export class InvoicesResolver {
  constructor(
    @Inject('IInvoicesService')
    private readonly invoiceService: IInvoicesService,
  ) {}

  @Query(() => InvoiceList, {
    name: 'icelandicGovernmentInstitutionsInvoices',
    nullable: true,
  })
  @BypassAuth()
  async getInvoices(
    @Args('input', { type: () => InvoiceListInput })
    input: InvoiceListInput,
  ): Promise<InvoiceList | null> {
    return this.invoiceService.getOpenInvoices(input)
  }
}
