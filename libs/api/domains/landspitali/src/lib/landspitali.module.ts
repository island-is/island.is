import { Module } from '@nestjs/common'
import { LandspitaliResolver } from './landspitali.resolver'
import { ClientsPaymentsModule } from '@island.is/clients/payments'
import { LandspitaliService } from './landspitali.service'
import { ChargeFjsV2ClientModule } from '@island.is/clients/charge-fjs-v2'
import { EmailModule } from '@island.is/email-service'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [
    ClientsPaymentsModule,
    ChargeFjsV2ClientModule,
    EmailModule,
    FeatureFlagModule,
  ],
  providers: [LandspitaliResolver, LandspitaliService],
})
export class LandspitaliModule {}
