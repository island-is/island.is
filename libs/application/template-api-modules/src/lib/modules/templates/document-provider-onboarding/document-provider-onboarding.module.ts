import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'

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
