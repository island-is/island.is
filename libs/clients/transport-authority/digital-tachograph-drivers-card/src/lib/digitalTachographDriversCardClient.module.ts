import { Module } from '@nestjs/common'
import { DigitalTachographDriversCardClient } from './digitalTachographDriversCardClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, DigitalTachographDriversCardClient],
  exports: [DigitalTachographDriversCardClient],
})
export class DigitalTachographDriversCardClientModule {}
