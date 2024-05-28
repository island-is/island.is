import { Module } from '@nestjs/common'
import { ApiConfig, ApiProviders } from './ultraviolet-radiation.provider'
import { UltravioletRadiationClientService } from './ultraviolet-radiation.service'

@Module({
  providers: [ApiConfig, ...ApiProviders, UltravioletRadiationClientService],
  exports: [UltravioletRadiationClientService],
})
export class UltravioletRadiationClientModule {}
