import { DynamicModule } from '@nestjs/common'

import { SkilavottordModule } from '@island.is/clients/skilavottord'

import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedTemplateAPIModule } from '../../shared'
import {
  SkilavottordService
} from './skilavottord.service'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'

export class SkilavottordsModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: SkilavottordsModule,
      imports: [
        SkilavottordModule.register(),
        SharedTemplateAPIModule.register(config),
        ApplicationApiCoreModule,
      ],
      providers: [
        SkilavottordService
      ],
      exports: [SkilavottordService],
    }
  }
}
