import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
import { CriminalRecordService } from './criminal-record.service'

export class CriminalRecordModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: CriminalRecordModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [CriminalRecordService],
      exports: [CriminalRecordService],
    }
  }
}