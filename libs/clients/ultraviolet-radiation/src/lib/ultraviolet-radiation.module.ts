import { Module } from '@nestjs/common'
import {
  ApiLatestMeasurementConfig,
  ApiMeasurementSeriesConfig,
  ApiProviders,
} from './ultraviolet-radiation.provider'
import { UltravioletRadiationClientService } from './ultraviolet-radiation.service'

@Module({
  providers: [
    ApiLatestMeasurementConfig,
    ApiMeasurementSeriesConfig,
    ...ApiProviders,
    UltravioletRadiationClientService,
  ],
  exports: [UltravioletRadiationClientService],
})
export class UltravioletRadiationClientModule {}
