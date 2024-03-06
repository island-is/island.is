import { DynamicModule } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { BaseTemplateAPIModuleConfig } from '../../../types'
import { HomeSupportService } from './home-support.service'
import { ArborgWorkpointModule } from '@island.is/clients/workpoint/arborg'

export class HomeSupportModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: HomeSupportModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        ArborgWorkpointModule,
      ],
      providers: [HomeSupportService],
      exports: [HomeSupportService],
    }
  }
}
