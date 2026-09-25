import { Module } from '@nestjs/common'
import { DirectorateOfEqualityClientModule } from '@island.is/clients/directorate-of-equality'
import { UltravioletRadiationClientModule } from '@island.is/clients/ultraviolet-radiation'
import { StatisticsClientService } from './statistics.service'
import { enhancedFetch } from './fetchConfig'

@Module({
  imports: [
    UltravioletRadiationClientModule,
    DirectorateOfEqualityClientModule,
  ],
  providers: [enhancedFetch, StatisticsClientService],
  exports: [StatisticsClientService],
})
export class StatisticsClientModule {}
