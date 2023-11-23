import { DynamicModule } from '@nestjs/common'

import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedTemplateAPIModule } from '../../shared'
import { CarRecyclingService } from './car-recycling.service'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { RecyclingFundClientModule } from '@island.is/clients/recycling-fund'

export class CarRecyclingModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: CarRecyclingModule,
      imports: [
        RecyclingFundClientModule,
        SharedTemplateAPIModule.register(config),
        ApplicationApiCoreModule,
      ],
      providers: [CarRecyclingService],
      exports: [CarRecyclingService],
    }
  }
}
