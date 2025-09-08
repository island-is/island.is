import { Module } from '@nestjs/common'
import { LandspitaliResolver } from './landspitali.resolver'
import { ClientsPaymentsModule } from '@island.is/clients/payments'
import { LandspitaliService } from './landspitali.service'
import { ChargeFjsV2ClientModule } from '@island.is/clients/charge-fjs-v2'

@Module({
  imports: [ClientsPaymentsModule, ChargeFjsV2ClientModule],
  providers: [LandspitaliResolver, LandspitaliService],
})
export class LandspitaliModule {}
