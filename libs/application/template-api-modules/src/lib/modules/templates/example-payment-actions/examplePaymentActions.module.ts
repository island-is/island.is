import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
import { ExamplePaymentActionsService } from './examplePaymentActions.service'

export class ExamplePaymentActionsModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ExamplePaymentActionsModule,
      imports: [SharedTemplateAPIModule.register(baseConfig)],
      providers: [ExamplePaymentActionsService],
      exports: [ExamplePaymentActionsService],
    }
  }
}
