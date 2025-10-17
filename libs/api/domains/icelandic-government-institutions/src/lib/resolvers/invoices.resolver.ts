import { Audit } from '@island.is/nest/audit'
import { Query, Resolver } from '@nestjs/graphql'
import { BypassAuth } from '@island.is/auth-nest-tools'
import { IInvoicesService } from '../services/invoices/invoices.service.interface'
import { InvoiceList } from '../models/invoiceList.model'
import { Inject } from '@nestjs/common'

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
  async getInvoices(): Promise<InvoiceList | null> {
    const k = 8 //dummy
    return this.invoiceService.getOpenInvoices()
  }
}
