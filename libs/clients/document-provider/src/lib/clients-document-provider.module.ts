import { DynamicModule } from '@nestjs/common'
import { ClientsDocumentProviderService } from './clients-document-provider.service'

export interface DocumentProviderModuleConfig {
  basePath: string
}

export class ClientsDocumentProviderModule {
  static register(config: DocumentProviderModuleConfig): DynamicModule {
    return {
      module: ClientsDocumentProviderModule,
      providers: [
        {
          provide: 'SERVICE_DOCUMENTS_BASEPATH',
          useValue: config.basePath || '',
        },
        ClientsDocumentProviderService,
      ],
      exports: [ClientsDocumentProviderService],
    }
  }
}
