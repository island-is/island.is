import { Module } from '@nestjs/common'
import { DirectorateOfEqualityStatisticsClientModule } from '@island.is/clients/directorate-of-equality-statistics'
import { UltravioletRadiationClientModule } from '@island.is/clients/ultraviolet-radiation'
import { StatisticsClientService } from './statistics.service'
import { enhancedFetch } from './fetchConfig'

@Module({
  imports: [
    UltravioletRadiationClientModule,
    DirectorateOfEqualityStatisticsClientModule,
  ],
  providers: [enhancedFetch, StatisticsClientService],
  exports: [StatisticsClientService],
})
export class StatisticsClientModule {}
