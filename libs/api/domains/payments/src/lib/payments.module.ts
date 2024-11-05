import { Module } from '@nestjs/common'
import { PaymentsResolver } from './payments.resolver'

import { ClientsPaymentsModule } from '@island.is/clients/payments'
import { PaymentsService } from './payments.service'

@Module({
  imports: [ClientsPaymentsModule],
  providers: [PaymentsResolver, PaymentsService],
})
export class ApiDomainsPaymentsModule {}
