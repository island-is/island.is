import { DynamicModule, HttpModule } from '@nestjs/common'

import { DocumentProviderResolver } from './document-provider.resolver'
import { DocumentProviderService } from './document-provider.service'
import {
  DocumentProviderClient,
  DocumentProviderClientConfig,
  DOCUMENT_PROVIDER_CLIENT_CONFIG,
} from './client/documentProviderClient'
import { DocumentProviderRepository } from './document-provider.repository'

export class DocumentProviderModule {
  static register(config: DocumentProviderClientConfig): DynamicModule {
    return {
      module: DocumentProviderModule,
      imports: [
        HttpModule.register({
          timeout: 10000,
        }),
      ],
      providers: [
        DocumentProviderResolver,
        DocumentProviderService,
        DocumentProviderRepository,
        DocumentProviderClient,
        {
          provide: DOCUMENT_PROVIDER_CLIENT_CONFIG,
          useValue: config,
        },
      ],
    }
  }
}
