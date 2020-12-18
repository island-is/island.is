import { DynamicModule, HttpModule } from '@nestjs/common'

import { DocumentProviderResolver } from './document-provider.resolver'
import { DocumentProviderService } from './document-provider.service'
import { DocumentProviderRepository } from './document-provider.repository'
import { DocumentProviderClientProd } from './client/documentProviderClientProd'
import {
  DocumentProviderConfig,
  DOCUMENT_PROVIDER_CLIENT_CONFIG_PROD,
  DOCUMENT_PROVIDER_CLIENT_CONFIG_TEST,
} from './client/documentProviderClientConfig'
import { DocumentProviderClientTest } from './client/documentProviderClientTest'

export class DocumentProviderModule {
  static register(config: DocumentProviderConfig): DynamicModule {
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
        DocumentProviderClientTest,
        {
          provide: DOCUMENT_PROVIDER_CLIENT_CONFIG_TEST,
          useValue: config.test,
        },
        DocumentProviderClientProd,
        {
          provide: DOCUMENT_PROVIDER_CLIENT_CONFIG_PROD,
          useValue: config.prod,
        },
      ],
    }
  }
}
