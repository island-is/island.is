import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { EnergyFundsService } from './energy-funds.service'
import { ConfigModule } from '@nestjs/config'
import {
  EnergyFundsClientConfig,
  EnergyFundsClientModule,
} from '@island.is/clients/energy-funds'
import {
  VehiclesClientModule,
  VehiclesClientConfig,
} from '@island.is/clients/vehicles'

@Module({
  imports: [
    SharedTemplateAPIModule,
    EnergyFundsClientModule,
    VehiclesClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnergyFundsClientConfig, VehiclesClientConfig],
    }),
  ],
  providers: [EnergyFundsService],
  exports: [EnergyFundsService],
})
export class EnergyFundsModule {}
