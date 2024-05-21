import { Module } from '@nestjs/common'
import {
  UltravioletRadiationClientModule,
  UltravioletRadiationClientService,
} from '@island.is/clients/ultraviolet-radiation'
import { StatisticsClientService } from './statistics.service'
import { enhancedFetch } from './fetchConfig'

@Module({
  imports: [UltravioletRadiationClientModule],
  providers: [
    enhancedFetch,
    StatisticsClientService,
    UltravioletRadiationClientService,
  ],
  exports: [StatisticsClientService],
})
export class StatisticsClientModule {}
