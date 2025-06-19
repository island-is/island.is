import { Module } from '@nestjs/common'
import { ExemptionForTransportationClient } from './exemptionForTransportationClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, ExemptionForTransportationClient],
  exports: [ExemptionForTransportationClient],
})
export class ExemptionForTransportationClientModule {}
