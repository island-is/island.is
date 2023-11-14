import { Module } from '@nestjs/common'
import { EhicClient } from './ehicCardClient.service'
import { RightsPortalClientModule } from '@island.is/clients/icelandic-health-insurance/rights-portal'

@Module({
  imports: [RightsPortalClientModule],
  providers: [EhicClient],
  exports: [EhicClient],
})
export class EhicModule {}
