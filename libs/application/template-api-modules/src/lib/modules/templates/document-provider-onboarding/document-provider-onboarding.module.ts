import { DynamicModule } from '@nestjs/common'
import {
  ClientsDocumentProviderModule,
  ClientsDocumentProviderService,
} from '@island.is/clients/document-provider'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { DocumentProviderOnboardingService } from './document-provider-onboarding.service'

const SERVICE_DOCUMENTS_BASEPATH =
  process.env.SERVICE_DOCUMENTS_BASEPATH ?? 'http://localhost:3369'

export class DocumentProviderOnboardingModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: DocumentProviderOnboardingModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        ClientsDocumentProviderModule.register({
          basePath: SERVICE_DOCUMENTS_BASEPATH,
        }),
      ],
      providers: [
        DocumentProviderOnboardingService,
        ClientsDocumentProviderService,
        {
          provide: 'SERVICE_DOCUMENTS_BASEPATH',
          useValue: SERVICE_DOCUMENTS_BASEPATH,
        },
      ],
      exports: [DocumentProviderOnboardingService],
    }
  }
}
