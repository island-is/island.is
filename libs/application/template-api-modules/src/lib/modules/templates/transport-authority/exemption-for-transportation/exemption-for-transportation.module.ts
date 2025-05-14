import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { ExemptionForTransportationService } from './exemption-for-transportation.service'

@Module({
  imports: [SharedTemplateAPIModule],
  providers: [ExemptionForTransportationService],
  exports: [ExemptionForTransportationService],
})
export class ExemptionForTransportationModule {}
