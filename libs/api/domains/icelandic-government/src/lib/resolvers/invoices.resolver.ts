import { Audit } from '@island.is/nest/audit'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { BypassAuth } from '@island.is/auth-nest-tools'
import { type IInvoicesService } from '../services/invoices/invoices.service.interface'
import { Inject } from '@nestjs/common'
import { InvoicesInput } from '../dtos/getInvoices.input'
import { InvoicesFilters } from '../models/invoicesFilters'
import { Invoices } from '../models/invoices.model'

@Resolver()
@Audit({ namespace: '@island.is/api/icelandic-government' })
export class InvoicesResolver {
  constructor(
    @Inject('IInvoicesService')
    private readonly invoiceService: IInvoicesService,
  ) {}

  @Query(() => Invoices, {
    name: 'icelandicGovernmentInvoices',
    nullable: true,
  })
  @BypassAuth()
  async getInvoices(
    @Args('input', { type: () => InvoicesInput })
    input: InvoicesInput,
  ): Promise<Invoices | null> {
    return this.invoiceService.getOpenInvoices(input)
  }

  @Query(() => InvoicesFilters, {
    name: 'icelandicGovernmentInvoicesFilters',
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
