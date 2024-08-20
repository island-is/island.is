import { Module } from '@nestjs/common'
import { UltravioletRadiationClientModule } from '@island.is/clients/ultraviolet-radiation'
import { StatisticsClientService } from './statistics.service'
import { enhancedFetch } from './fetchConfig'

@Module({
  imports: [UltravioletRadiationClientModule],
  providers: [enhancedFetch, StatisticsClientService],
  exports: [StatisticsClientService],
})
export class StatisticsClientModule {}
