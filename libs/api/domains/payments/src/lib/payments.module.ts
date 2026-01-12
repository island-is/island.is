import { Module } from '@nestjs/common'

import { ClientsPaymentsModule } from '@island.is/clients/payments'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { PaymentsResolver } from './payments.resolver'
import { PaymentsService } from './payments.service'

@Module({
  imports: [ClientsPaymentsModule, FeatureFlagModule],
  providers: [PaymentsResolver, PaymentsService],
})
export class ApiDomainsPaymentsModule {}
