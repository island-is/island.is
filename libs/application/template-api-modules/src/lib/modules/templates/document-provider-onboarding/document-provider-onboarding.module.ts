import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
import { DocumentProviderOnboardingService } from './document-provider-onboarding.service'

export class DocumentProviderOnboardingModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: DocumentProviderOnboardingModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [DocumentProviderOnboardingService],
      exports: [DocumentProviderOnboardingService],
    }
  }
}
