import { Module } from '@nestjs/common'
import { IdsClientConfig } from '@island.is/nest/config'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import { EnergyFundsClientService } from './energyFundsClient.service'

@Module({
  imports: [IdsClientConfig.registerOptional()],
  providers: [ApiConfiguration, EnergyFundsClientService, ...exportedApis],
  exports: [EnergyFundsClientService],
})
export class EnergyFundsClientModule {}
