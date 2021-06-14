import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
import { PayableDummyTemplateService } from './payable-dummy-template.service'

export class PayableDummyTemplateModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: PayableDummyTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
      ],
      providers: [PayableDummyTemplateService],
      exports: [PayableDummyTemplateService],
    }
  }
}
