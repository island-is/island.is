import { DynamicModule } from '@nestjs/common'

import { SkilavottordModule as SModule } from '@island.is/clients/skilavottord'

import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedTemplateAPIModule } from '../../shared'
import {
  SkilavottordService
} from './skilavottord.service'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'

export class SkilavottordModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: SModule,
      imports: [
        SModule,
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
