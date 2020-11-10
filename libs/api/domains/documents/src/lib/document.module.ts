import { DynamicModule, HttpModule } from '@nestjs/common'
import { DocumentResolver } from './document.resolver'
import { DocumentService } from './document.service'
import {
  DocumentClient,
  DocumentClientConfig,
  DOCUMENT_CLIENT_CONFIG,
} from './client/documentClient'

export class DocumentModule {
  static register(config: DocumentClientConfig): DynamicModule {
    return {
      module: DocumentModule,
      imports: [
        HttpModule.register({
          timeout: 10000,
        }),
      ],
      providers: [
        DocumentResolver,
        DocumentService,
        DocumentClient,
        {
          provide: DOCUMENT_CLIENT_CONFIG,
          useValue: config,
        },
      ],
    }
  }
}
