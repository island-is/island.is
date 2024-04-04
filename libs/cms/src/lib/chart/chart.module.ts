import { Module } from '@nestjs/common'
import { UltravioletRadiationClientModule } from '@island.is/clients/ultraviolet-radiation'
import { StatisticsClientModule } from '@island.is/clients/statistics'
import {
  UltravioletRadiationLatestMeasurementService,
  UltravioletRadiationSeriesService,
} from './services/ultraviolet-radiation'
import { ChartService } from './chart.service'
import { ChartDataByExternalJsonProviderDataLoader } from '../loaders/chartDataByExternalJsonProvider.loader'
import { ChartResolver } from './chart.resolver'

@Module({
  imports: [StatisticsClientModule, UltravioletRadiationClientModule],
  providers: [
    UltravioletRadiationLatestMeasurementService,
    UltravioletRadiationSeriesService,
    ChartService,
    ChartDataByExternalJsonProviderDataLoader,
    ChartResolver,
  ],
  exports: [ChartResolver],
})
export class ChartModule {}
