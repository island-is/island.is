import { DynamicModule } from '@nestjs/common'

import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedTemplateAPIModule } from '../../shared'
import { CarRecyclingService } from './car-recycling.service'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { CarRecyclingClientModule } from '@island.is/clients/car-recycling'
import { VehiclesClientModule } from '@island.is/clients/vehicles'

export class CarRecyclingModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: CarRecyclingModule,
      imports: [
        CarRecyclingClientModule,
        SharedTemplateAPIModule.register(config),
        ApplicationApiCoreModule,
        VehiclesClientModule,
      ],
      providers: [CarRecyclingService],
      exports: [CarRecyclingService],
    }
  }
}
