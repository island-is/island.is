import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { XRoadConfig, IdsClientConfig } from '@island.is/nest/config'
import { RskRentalDayRateConfigurationProvider } from './apiConfiguration'
import { RskRentalDayRateClient } from './RskRentalDayRateClient'
import { RskRentalDayRateClientConfig } from './RskRentalDayRateClientConfig'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [RskRentalDayRateClientConfig, XRoadConfig, IdsClientConfig],
    }),
  ],
  providers: [RskRentalDayRateClient, RskRentalDayRateConfigurationProvider],
  exports: [RskRentalDayRateClient],
})
export class RskRentalDayRateClientModule {}
