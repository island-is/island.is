import { Audit } from '@island.is/nest/audit'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { type IInvoicesService } from '../services/invoices/invoices.service.interface'
import { Inject } from '@nestjs/common'
import { InvoiceGroup } from '../models/invoiceGroup.model'
import { Invoice } from '../models/invoice.model'
import { type InvoiceGroupWithFilters } from '../types'

@Resolver(() => InvoiceGroup)
@Audit({ namespace: '@island.is/api/icelandic-government-institutions' })
export class InvoiceGroupResolver {
  constructor(
    @Inject('IInvoicesService')
    private readonly invoiceService: IInvoicesService,
  ) {}

  @ResolveField('invoices', () => [Invoice])
  resolveInvoices(
    @Parent() invoiceGroup: InvoiceGroupWithFilters,
  ): Promise<Invoice[] | null> {
    return this.invoiceService.getOpenInvoicesByGroup({
      supplier: invoiceGroup.supplier.id,
      customer: invoiceGroup.customer.id,
      dateFrom: invoiceGroup.dateFrom,
      dateTo: invoiceGroup.dateTo,
      types: invoiceGroup.types,
    })
  }
}
