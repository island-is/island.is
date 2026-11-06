import { Module } from '@nestjs/common'
import { GovernmentInvoicesClientModule } from '@island.is/clients/government-invoices'
import { InvoicesService } from './services/invoices/invoices.service'
import { InvoicePaymentsGroupResolver } from './resolvers/invoicePaymentsGroup.resolver'
import { InvoicePaymentsGroupsResolver } from './resolvers/invoicePaymentsGroups.resolver'

@Module({
  imports: [GovernmentInvoicesClientModule],
  providers: [
    InvoicesService,
    InvoicePaymentsGroupResolver,
    InvoicePaymentsGroupsResolver,
  ],
})
export class IcelandicGovernmentInstitutionsModule {}
