import { Module } from '@nestjs/common'
import {
  DailyApiConfig,
  HourlyApiConfig,
  ApiProviders,
} from './ultraviolet-radiation.provider'
import { UltravioletRadiationClientService } from './ultraviolet-radiation.service'

@Module({
  providers: [
    DailyApiConfig,
    HourlyApiConfig,
    ...ApiProviders,
    UltravioletRadiationClientService,
  ],
  exports: [UltravioletRadiationClientService],
})
export class UltravioletRadiationClientModule {}
