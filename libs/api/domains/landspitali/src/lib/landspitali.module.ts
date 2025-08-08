import { Module } from '@nestjs/common'
import { LandspitaliResolver } from './landspitali.resolver'
import { ClientsPaymentsModule } from '@island.is/clients/payments'
import { LandspitaliService } from './landspitali.service'

@Module({
  imports: [ClientsPaymentsModule],
  providers: [LandspitaliResolver, LandspitaliService],
})
export class LandspitaliModule {}
