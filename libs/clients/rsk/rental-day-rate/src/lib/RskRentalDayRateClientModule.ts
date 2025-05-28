import { Module } from '@nestjs/common'
import { RskRentalDayRateConfigurationProvider } from './apiConfiguration'
import { RskRentalDayRateClient } from './RskRentalDayRateClient'

@Module({
  providers: [RskRentalDayRateClient, RskRentalDayRateConfigurationProvider],
  exports: [RskRentalDayRateClient],
})
export class RskRentalDayRateClientModule {}
