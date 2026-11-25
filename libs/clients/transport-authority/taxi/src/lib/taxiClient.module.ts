import { Module } from '@nestjs/common'
import { TaxiClient } from './taxiClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, TaxiClient],
  exports: [TaxiClient],
})
export class TaxiClientModule {}
