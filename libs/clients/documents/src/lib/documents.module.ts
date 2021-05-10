import { DynamicModule, HttpModule, Module } from '@nestjs/common'
import {
  DocumentClient,
  DocumentClientConfig,
  DOCUMENT_CLIENT_CONFIG,
} from './documentClient'

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class DocumentsClientModule {
  static register(config: DocumentClientConfig): DynamicModule {
    return {
      module: DocumentsClientModule,
      imports: [HttpModule.register({})],
      providers: [
        DocumentClient,
        {
          provide: DOCUMENT_CLIENT_CONFIG,
          useValue: config,
        },
      ],
      exports: [DocumentClient],
    }
  }
}
