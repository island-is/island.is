import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
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

export class EnergyFundsModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: EnergyFundsModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        EnergyFundsClientModule,
        VehiclesClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [EnergyFundsClientConfig, VehiclesClientConfig],
        }),
      ],
      providers: [EnergyFundsService],
      exports: [EnergyFundsService],
    }
  }
}
