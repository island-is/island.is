import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
import { ReferenceTemplateService } from './reference-template.service'
import { ArborgWorkpointModule } from '@island.is/clients/workpoint/arborg'

export class ReferenceTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ReferenceTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        ArborgWorkpointModule,
      ],
      providers: [ReferenceTemplateService],
      exports: [ReferenceTemplateService],
    }
  }
}
