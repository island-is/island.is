import { DynamicModule } from '@nestjs/common'
import { DocumentResolver } from './document.resolver'
import { DocumentService } from './document.service'
import {
  DocumentClientConfig,
  DocumentsClientModule,
} from '@island.is/clients/documents'

export class DocumentModule {
  static register(config: DocumentClientConfig): DynamicModule {
    return {
      module: DocumentModule,
      imports: [
        DocumentsClientModule.register({
          basePath: config.basePath,
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          tokenUrl: config.tokenUrl,
        }),
      ],
      providers: [DocumentResolver, DocumentService],
    }
  }
}
